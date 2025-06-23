const net = require('net');

const server = net.createServer((socket) => {
  console.log('클라이언트 연결됨:', socket.remoteAddress, socket.remotePort);
  // 클라이언트로부터 데이터 수신
  socket.on('data', (data) => {
    console.log('클라이언트로부터 메시지:', data.toString());
    // 서버에서 클라이언트로 데이터 전송
    if(data.toString().substring(16,17) == '1'){
      console.log('@@@@@@@@@@@@@');
      socket.write('HeadHeadHeadHead응답전문1234561234567890');
    }else if(data.toString().substring(16,17) == '2'){
      socket.write('HeadHeadHeadHead응답전문654321테스트12');
    }else if(data.toString().substring(16,17) == '3'){
      socket.write('HeadHeadHeadHead응답전문987654  과일12 201사과02  배');
    }
  });

  // 연결 종료 처리
  socket.on('end', () => {
    console.log('클라이언트 연결 종료');
  });

  // 에러 처리
  socket.on('error', (err) => {
    console.error('서버 에러:', err.message);
  });
});

// 서버 시작
server.listen(4000, () => {
  console.log('TCP 서버가 4000번 포트에서 실행 중');
});