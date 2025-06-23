
var path = require('path');

global.ROOT = path.resolve(__dirname);

var config = require('./config');

config(function() {
    require('./src/app');
    process.on('uncaughtException',function(err) {
        logger.error('====== uncaughtException ========');
        logger.error(err);
        logger.error('====== uncaughtException ========');
    });
})