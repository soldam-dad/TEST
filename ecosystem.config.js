module.exports = {
  apps: [
    {
      name: 'mci-backend',
      script: 'server.js',
	      error_file: `/app/logs/${process.env.SERVER_NAME || 'apiwrap'}.log`,
    out_file: `/app/logs/${process.env.SERVER_NAME || 'apiwrap'}.log`,
      exec_mode: 'cluster',       // 실행 모드: 'fork' or 'cluster'
      instances: 3,           // 최대 CPU 코어 수만큼 실행
      autorestart: true,          // 앱 종료 시 자동 재시작
      watch: false,               // 파일 변경 시 자동 재시작 (개발시 true)
      max_memory_restart: '512M', // 메모리 초과 시 재시작
      env: {
        NODE_ENV: 'development',  // 기본 환경
        NODE_CLUSTER_SCHED_POLICY: "rr",  // 환경변수 설정
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',   // 프로덕션 환경 변수
        PORT: 8080
      }
    }
  ]
};