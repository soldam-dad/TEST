var momentT = require('moment-timezone');
var iconv = require('iconv-lite');

function nullchk(obj) {
	if( obj == null || obj == undefined) {
		return '';
	} else {
		return String(obj).trim();
	}
}

function makeTimeString(dateTime, format) {
	if(dateTime && dateTime.length > 0) {
		dateTime = momentT(dateTime).tz('Asia/Seoul').format(format|| 'YYYYMMDDHHmmssSS');
	}else {
		dateTime = momentT().tz(TZ).format(format || 'YYYYMMDDHHmmssSS');
	}
	return dateTime;
}

function appendStr(target, len, value) {
	let b = Buffer.alloc(len, 0x20);
	b.write(value);
	return target + b.toString();
}

function appendBuff(buffer, len, value) {
	let b = Buffer.alloc(len, 0x20);
	b.write(value);
	return Buffer.concat([buffer,b]);
}

function appendBuff1(buffer, len, value) {
	let b = Buffer.alloc(len, 0x20);
	
	let krBuf = iconv.encode(value, 'euc-kr');
	krBuf.copy(b, 0,0,krBuf.length);

	return Buffer.concat([buffer,b]);
}

function sliceBuff(buff, start, len) {
	
	return (iconv.decode(buff.slice(start,len+start), 'euc-kr')).trim();
 
}

function bufToUtf8(buf) {
	return iconv.decode(buf, 'euc-kr');
}

function strToEuckr(str) {
	return iconv.encode(str, 'euc-kr')
}

function formatLength(items) {
	let length = 0;
	for(let item of items) {
		if( item.length) {
			length = length + parseInt(item.length);
		}
	}
	return length;
}

function setReturnCode(code, msg) {
	return {
		resultCode : code,
		resultMessage :msg
	}
}

//총바이트수 조회
function getBytes(str){
	let character;
	let charBytes = 0;

	for(let i = 0 ; i < str.length; i++){
		character = str.charAt(i);
		
		if(escape(character).length > 4){
			charBytes += 2;
		}else{
			charBytes += 1;
		}
	}	
	return charBytes;
}

//문자열의 json 데이터 여부 확인
function getJsonYn(str) {
	try{
		let json = JSON.parse(str);
		return (typeof json === 'object');
	}catch(e){
		return false;
	}
}

//문자열의 한글만 길이 구하기
function getByteKr(str) {
	let bNum = 0;
	for (let i = 0 ; i< str.length; i++){
		if(str.charCodeAt(i) > 127){
			bNum ++ 
		}
	}
	return bNum;
}


module.exports = {
    nullchk,
    makeTimeString,
    appendStr,
    appendBuff,
    sliceBuff,
    bufToUtf8,
    strToEuckr,
    formatLength,
    setReturnCode,
	getBytes,
	getJsonYn,
	getByteKr,
	appendBuff1
}
