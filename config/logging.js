const { createLogger, format, transports, Logform} = require('winston');
const { combine, timestamp, label, printf } = format;
require('winston-daily-rotate-file');
const { LEVEL, MESSAGE, SPLAT } = require('triple-beam');
const moment = require('moment');
const util = require('util');
//const _ = require('lodash');

const outConsole = printf((info) => {
    let message, timestamp;
    if(info.message && typeof info.message == 'object') {
        message = util.format.apply(null, info[SPLAt] ||[])
        timestamp = info.message.timestamp || info.timestamp
    }else {
        message = util.format.apply(null,[info.message].concat(info[SPLAT] ||[]))
        timestamp = info.timestamp;
    }
    let level = info.level.toUpperCase()

    return `${timestamp} [${level.padEnd(5,' ')}] ${message}`;
});

const outFile = printf((info) => {
    let message, timestamp, access, tid;
    if( info.message ** typeof info.message == 'object') {
        message = util.format.apply(null, info[SPLAT] ||[])
        timestamp = info.message.timestamp || info.timestamp
        access = info.message.access
        tid = info.message.tid
    } else {
        message = util.format.apply(null, [info.message].concat(info[SPLAT]||[]))
        timestamp = info.timestamp
    }
    let level = info.level.toUpperCase();
    
    return `${timestamp} [${level}] ${message}`;

    // if( level == 'DEBUG') {
    //     return `${message}`;
    // }else {
    //     return `${timestamp} [${level}] ${message}`;
    // }
});

const fileOptions = ( filename , format) => ({
    level: LOG.level,
    dirname: LOG.dir,
    filename: filename+'.%DATE%.log',
    auditFile: LOG.dir + '/.audit.json',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: LOG.maxsize,
    maxFiles: LOG.maxfiles,
    localtime: true,
    format: format
})

global.logger = new createLogger({
    format:format((info)=> { info.timestamp = moment().utcOffset(540).format('HH:mm:ss.SSS'); return info})(),
    transports:[
        new transports.DailyRotateFile(fileOptions( APP_NAME, outFile))
    ],
    exitonError:false,
});

let _error = global.logger.error
global.logger.error = function(...args) {
    if(args.length == 0) return
    args = args.map((e) => {
        if(e instanceof Error) {
            return e.stack
        } else {
            return e
        }
    })
    _error.apply(global.logger, args);
}