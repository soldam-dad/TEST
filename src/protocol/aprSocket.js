const net = require('net');
const RECONNECT_INTERVAL = 1000; // 재연결 시도 간격 (ms)

let client;

class aprSocket {
	constructor() {
		this.socket = null;
		this.connected = false;
		this.callback = null;
		this.reconnectTimeout = null;

		this.init();
	}

	init() {
		this.socket = new net.Socket();

		this.socket.connect(APR.port[0], APR.address[0], () => {
			this.connected = true;
			console.log(`==>> 업무계 소켓 연결 IP[${APR.address[0]}] PORT[${APR.port[0]}]`);
		});

		this.socket.on('data', (data) => {
			console.log("========== 업무계 서버에서 응답값 ==========");
			console.log(data.toString());
			console.log("==========================================");

			logger.info("========== 업무계 서버에서 응답값 ==========");
			logger.info(data.toString());
			logger.info("==========================================");

			if (this.callback) {
				this.callback(data);
				this.callback = null;
			}
		});

		this.socket.on('error', (err) => {
			logger.warn('==>> APR socket error [%j]:', err);
			this.reconnect();
		});

		this.socket.on('close', () => {
			logger.info('==>> APR socket closed');
			this.reconnect();
		});

		this.socket.on('timeout', () => {
			logger.debug('==>> APR socket timeout!!');
			this.socket.destroy();
		});
	}

	reconnect() {
		if (this.connected) {
			logger.warn('==>> 소켓 연결 끊김. 재시도 중...');
		}
		this.connected = false;

		if (this.socket) {
			this.socket.destroy();
			this.socket = null;
		}

		if (!this.reconnectTimeout) {
			this.reconnectTimeout = setTimeout(() => {
				this.reconnectTimeout = null;
				this.init(); // 재연결 시도
			}, RECONNECT_INTERVAL);
		}
	}

	async send(msg, callback) {
		if (!this.connected) {
			logger.warn('==>> 소켓 미연결 상태, 재연결 시도 후 전송');
			await new Promise(resolve => setTimeout(resolve, RECONNECT_INTERVAL));
			if (!this.connected) {
				throw new Error('소켓 연결 실패, 데이터 전송 불가');
			}
		}

		this.callback = callback;

		return new Promise((resolve, reject) => {
			this.socket.write(msg, (err) => {
				if (err) {
					this.callback = null;
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

async function callAPI(params, callback){
	await client.send(params, callback);
};

function init(){
	client = new aprSocket();
}

module.exports = {
	init,
	callAPI
};