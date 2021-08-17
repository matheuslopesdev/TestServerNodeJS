import path from 'path';

import winston from 'winston';
import winstonRotating from 'winston-daily-rotate-file';
import expressWinston from 'express-winston';

export const rotatingTransport = new winston.transports.DailyRotateFile({
    filename: 'log-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(path.resolve(), 'logs')
})

const { combine, timestamp, printf } = winston.format;

const myFormat = combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    })
);

export const logger = winston.createLogger({
    format: myFormat,
    level: 'database',
    levels: { 
        error: 0, 
        warn: 1, 
        info: 2, 
        debug: 3, 
        database: 4 
      },
    transports: [ rotatingTransport ]
});

export const expressLogger = expressWinston.logger({ 
    format: myFormat,
    level: 'info',
    transports: [ rotatingTransport ],
    msg: 'method: {{req.method}} | url: {{req.url}} | status: {{res.statusCode}} | response time: {{res.responseTime}} ms'
});