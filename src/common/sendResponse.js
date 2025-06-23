function sendResponse(res, data) {

	if(data) {
		data.resultMessage = ( data.resultCode == '200' ? 'Success' : data.resultMessage);
		res.json(data);
	} else {
		next();
	}
}

module.exports = sendResponse;