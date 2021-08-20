import UserModel from '../models/user.js';
import MessageModel from '../models/message.js';

import { handleError } from '../utils/utils.js';
import { logger } from '../config/logger.js';
import { handleXlsxFromStream } from '../utils/fileUtils.js';
import Result from '../utils/result.js';

export default class MessageService {
    static #instance;

    static getInstance() {
        if(!this.#instance) {
            this.#instance = new MessageService();
        }

        return this.#instance;
    }

    async postMessage(message) {
        logger.debug(`Starting MessageService.postMessage with ${JSON.stringify(message)}`);
        
        let result;

        try {
            if(!message.userLogin || !message.text) {
                throw new Error('Body must have userLogin and text fields!');
            }

            const user = await UserModel.findByLogin(message.userLogin);

            if(!user) {
                throw new Error(`User ${message.userLogin} not found!`);
            }

            message.user = user._id;

            const document = new MessageModel(message);
            const dbResponse = await document.save();

            result = new Result(true, 'Message posted successfully');
            result.messageId = dbResponse._id;
        }
        catch(ex) {
            result = handleError(ex, logger);
        }

        logger.debug(`Finishing MessageService.postMessage with response ${JSON.stringify(result)}`);
        return result;
        
    }

    async postMessageBatch(fileStream, login) {
        logger.debug(`Starting MessageService.postMessageBatch with ${login}`);
        
        let result;

        try {
            const user = await UserModel.findByLogin(login);

            if(!user) {
                throw new Error(`User ${message.userLogin} not found!`);
            }

            const processedRows = await handleXlsxFromStream(fileStream, ['test'], this.processMessageRow.bind(user));
            // TODO: insert rows and send the app to aws
            result = new Result(true, processedRows);
        }
        catch(ex) {
            result = handleError(ex, logger);
        }

        logger.debug(`Finishing MessageService.postMessageBatch with response ${JSON.stringify(result)}`);
        return result;
    }

    processMessageRow(row) {
        if(row._number != 1) {
            return { user: this._id, text: row.getCell(1).value }
        }
        
        return null;
    }
}