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
    level: 'debug',
    transports: [ rotatingTransport ]
});

export const expressLogger = expressWinston.logger({ 
    format: myFormat,
    level: 'debug',
    transports: [ rotatingTransport ],
    msg: 'method: {{req.method}} | url: {{req.url}} | status: {{res.statusCode}} | response time: {{res.responseTime}} ms'
 })