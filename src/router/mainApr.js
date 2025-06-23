var getSendData = require('../common/getSendData');
var getRecvData = require('../common/getRecvData');
var aprSocket = require('../protocol/aprSocket');
var util = require('../utils/util');

//업무계 소켓 연결유지 index.js 로드 시 연결
aprSocket.init();

async function mainApr(IFTG, IFID, params) {
    let result = [];
	  console.log('============ [%s] 서비스 전문 전송 START ============', IFID);

    logger.info('============ [%s] 서비스 전문 전송 START ============', IFID);
    let sendOrgStr = getSendData(IFTG, IFID, params);

	result = await new Promise((resolve, reject) => {
  	aprSocket.callAPI(sendOrgStr, async function(recvBuf) {
    if (recvBuf == null) {
      logger.warn('recvBuf is null!! return 503');
      resolve(util.setReturnCode('503', 'packet is not valid'));
      return;
    }

    try {
      let data = await getRecvData(IFTG, IFID, recvBuf, params);
      console.log("==============================");
      console.log("화면에 전송할 응답 DATA RESULT");
      console.log(JSON.stringify(data, null, 2));
      console.log("==============================");

      logger.info("==============================");
      logger.info("화면에 전송할 응답 DATA RESULT");
      logger.info(JSON.stringify(data, null, 2));
      logger.info("==============================");
      resolve(data);
    } catch (err) {
      console.error("mainApr error:", err);
      resolve(util.setReturnCode('502', err.message));
    }
  });
});
	logger.info('============ MCI LINK packet end [%s] ============', IFID);
	return result;
}
module.exports = mainApr;
