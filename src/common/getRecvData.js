var util = require('../utils/util');

var MAX_ARRAY_ROWS = 1000;

var logFile = "";

async function getRecvData(IFTG, IFID, recvBuf, params) {

	let schmHead = "";
	let insResult = "";
	let protocolKey = "";
	if(IFTG == 'eai'){
		schmHead = SCHEMA.eaiheader.head;
	}else if(IFTG == 'apr'){
		schmHead = SCHEMA.header.head;
	}
	let schmProd = SCHEMA[IFID].prop;
	let schmRecv = SCHEMA[IFID].recv;

	let loc = {cur :0};
	let data = {};
	if(!recvBuf) {
		throw new Error('There is no results');
	}
	
	let headLen = '';
	let headBuf = '';
	let bodyBuf = '';
	if(IFTG != 'call'){
		headLen= util.formatLength(schmHead);
		headBuf = recvBuf.slice(0, headLen);
		bodyBuf = recvBuf.slice(headLen);
	}
	try {
		console.log("========== 업무계 서버에서 응답값 분리 ==========");
		console.log(IFTG+' 응답 헤더[%s]', headBuf.toString());
		console.log(IFTG+' 응답 본문[%s]', bodyBuf.toString());
		console.log("==================================");

		logger.info("========== 업무계 서버에서 응답값 분리 ==========");
		logger.info(IFTG+' 응답 헤더[%s]', headBuf.toString());
		logger.info(IFTG+' 응답 본문[%s]', bodyBuf.toString());
		logger.info("==================================");

		let resultCode = '';

		let decrStr = bodyBuf.toString();
		bodyBuf = util.strToEuckr(decrStr);

		//bodyBuf = descStr;
		let bodyLen = bodyBuf.length;

		if( bodyLen == 0 && schmRecv.length != 0 ) {
			return util.setReturnCode(resultCode || '510' , resultMessage);
		}

		//let headBuf1 = getBodyData(loc, schmHead, headBuf);

		loc = {cur :0};

		data = getBodyData(loc, schmRecv, bodyBuf);
		console.log("========== 업무계 서버에서 응답값 JSON으로 변경 ==========");
		console.log(data);
		console.log("========================================================");

		logger.info("========== 업무계 서버에서 응답값 JSON으로 변경 ==========");
		logger.info(data);
		logger.info("========================================================");


	}catch(error) {
		throw error;
	}
	return data;
}

function getBodyData(loc, items, buff) {
	let dataMap = {};
	//반복부의 반복되는 길이 담는 변수
	let elSize = 0;
	//반복부 이후의 전문 알기위한 변수
	let afElemtYn = 'N';
	//반복부 이후의 전문길이 담는 변수
	let afElemtLen = 0;
	//반복부 및 반복부 이후의 전문 길이 조회
	for(let item of items) {
		if( item.element) {
			for(let elItm of item.element){
				//반복부의 반복되는 전문 길이 조회
				elSize = elSize+elItm.length;
			}
			afElemtYn = 'Y';
		}else{
			if(afElemtYn == 'Y'){
				//반복부 이후 반복아닌 전문의 길이 조회 
				afElemtLen = afElemtLen + item.length;
			}
		}

	}

	for(let item of items) {

		if( item.onetime && loc.cur > 0) {
			continue;
		}	
		let nm = item.name;
		let val = util.sliceBuff(buff, loc.cur, item.length);
		loc.cur = loc.cur + item.length;
		if( loc.cur > buff.length) {
			throw new Error('Invalid packet reception');
		}

		if( item.element) {
			let list = [];	
			//반복부 반복건수 계산  = (총전문길이 - 반복부시작위치(반복부이전전문길이)-반복부이후의전문길이)/반복부의반복되는길이	
			let cnt = Math.floor((buff.length - loc.cur - afElemtLen)/elSize);	
			if( cnt > 0) {
				for(let i=0;i<cnt && i<MAX_ARRAY_ROWS;i++) {
					list.push(getBodyData(loc, item.element, buff));	
				}
			}
			dataMap[`${nm}cnt`] = cnt;
			dataMap[nm] = list;
		} else {
			
			dataMap[nm] = val;
			logger.debug('%s(%s):%s', nm.padEnd(17,' '), String(item.length).padStart(3, ' '), val);
		}
	}
	return dataMap;
}

module.exports = getRecvData
