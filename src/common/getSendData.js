var util = require('../utils/util');

var MAX_ARRAY_ROWS = 1000;

var logFile = "";

var sendEncData;

var getSendData= function(IFTG, IFID, params) {
	let schmHead = "";
	//EAI 헤더 추가 테스트용
	if(IFTG == 'eai'){
		schmHead = SCHEMA.eaiheader.head;
	}else if(IFTG == 'apr'){
		schmHead = SCHEMA.header.head;	
	}
	
	let schmProd = SCHEMA[IFID].prop;
	let schmSend = SCHEMA[IFID].send;
	//callback 전문은 헤더 없음
	let headLen = "";
	if(IFTG != 'call'){
		headLen = util.formatLength(schmHead);
	}
	
	let bodyLen = util.formatLength(schmSend);
	let actParam = "";


	//callback 전문은 헤더 없음
	let headBuf  = "";

	headBuf = createData(true, actParam, schmHead);

	let bodyBuf = createData(false, params, schmSend);

	if( bodyBuf == undefined || bodyBuf.length == 0) {
		throw new Error('send data error');
	}
	
	let sendStr = bodyBuf;
	
	//callback 전문은 헤더 없음
	let data = ""; 
	if(IFTG != 'call'){
		data = headBuf + sendStr;
	}else{
		data = sendStr;
	}
	console.log("========== 업무계 서버에 요청값 ==========");
	console.log(data);
	console.log("========================================");

	logger.info("========== 업무계 서버에 요청값 ==========");
	logger.info(data);
	logger.info("========================================");

	return data;
}

function activeParams(hLen,bLen,prop,IFTG,params) {
	let nowTime = util.makeTimeString();
	var now =  moment();
	let obj = {};
	
	obj.transCode 	= prop.transCode.padStart(9,'0');
	obj.textChar 	= prop.textChar;
	obj.msgCode 	= prop.msgCode;
	return obj;
}

function createData(isH, params, items) {
	let bufData = Buffer.alloc(0);
	for(let item of items) {
		let nm = item.name;
		
		if(item.element) {
			let cnt = 0;
			let tmp = params[nm];
			if( Array.isArray(tmp)) {
				cnt = tmp.length;
			}
			
			bufData = util.appendBuff(bufData, item.length,cnt.toString());
			
			for( let i=0;i<cnt && i<MAX_ARRAY_ROWS;i++) {
				let bufOne = createData(isH, tmp[i],item.element);
				bufData = Buffer.concat([bufData,bufOne]);
			}

		}else {
			let val = util.nullchk(params[nm]);
			if( item.default && val == '') {
				val = util.nullchk(item.default);			
			}

			if(item.notnull && val == '') {
				throw new Error(`It is required item: ${nm}`);
			}
			bufData = util.appendBuff(bufData,item.length, val);
		}
	}
	return bufData;
}

module.exports = getSendData
