import UserModel from '../models/user.js';
import MessageModel from '../models/message.js';

import { handleError } from '../utils/utils.js';
import { logger } from '../config/logger.js';
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
}