var express = require('express');
var router = express.Router();
var wrap = require('express-async-wrap');
var util = require('../utils/util');
var sendResponse = require('../common/sendResponse');

var mainApr = require('./mainApr');


router.get('/healthcheck', function(req, res, next) {
	logger.info('>> request router /healthcheck');
	let data = 'OK';
	res.send(data);
	res.end();
});
 

//post로 데이터 올경우
router.post('/:IFTG/:IFID', wrap(async function(req,res,next){ 
	try {
		let IFTG = req.params.IFTG; //송수신구분
		let IFID = req.params.IFID; //전문번호
		let params = req.body;
		console.log("========== 요청 INPUT 값 ==========");
		console.log("요청 서비스 IFTG :" + IFTG );
		console.log("요청 전문번호 :" + IFID );
		console.log("요청 params :" + JSON.stringify(params));
		console.log("==================================");

		logger.info("========== 요청 INPUT 값 ==========");
		logger.info("요청 서비스 IFTG :" + IFTG );
		logger.info("요청 전문번호 :" + IFID );
		logger.info("요청 params :" + JSON.stringify(params));
		logger.info("==================================");
		let result ;

		if( !SCHEMA[IFID]) {
			console.log("SCHEMA에 정의된 키들:", Object.keys(SCHEMA));
			throw new Error(`The schema id[${IFID}] is not exist.`);
		}

		if(IFTG == 'apr'){		
			result= await mainApr(IFTG, IFID, params);
		}
		sendResponse(res,result);
	} catch (err) {
		console.error("API 처리 중 오류:", err.message);
		logger.info("API 처리 중 오류:", err.message);
		sendResponse(res, util.setReturnCode('550', err.message));
	}	
}));
module.exports = router;
