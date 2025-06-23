var express = require('express');
var app = express();

const path = require('path');

//소스의 index.html 를 호출하기 위한 코드 테스트되면 삭제  http://localhost:3000/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


logger.info('');
logger.info('#####################################################');
logger.info('########### MCI Link Server module start!! ###########');
logger.info('#####################################################');

app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({limit:'5mb', extended:false}));

app.use('/', require('./router'));

app.use(function(err,req,res,next) {
	logger.error('error',err);
	res.status(550).send({resultCode:'550',resultMessage:err.message});	
});

app.use(function(req,res,next) {
	res.sendStatus(404);	
});

app.listen(PORT,function() {
	logger.info('==>> MCI Link Server runnning onport : %d', PORT);
});

logger.info('LOG config info [%j]', LOG)
