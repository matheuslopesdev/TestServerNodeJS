import path from 'path';
import rotatingFileStream from 'rotating-file-stream';

import debug from 'debug';

import { generateDatString } from '../utils/utils.js';

export const logStream = rotatingFileStream.createStream(`log-${generateDatString(new Date())}.log`, {
    interval: '1d',
    path: path.join(path.resolve(), 'logs')
});

process.stdout.pipe(logStream);
process.stderr.pipe(logStream);

export const logger = {
    debug: debug('APP:debug'),
    info: debug('APP:info'),
    warning: debug('APP:warning'),
    error: debug('APP:error')
}