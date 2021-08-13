import UserModel from '../models/user.js';
import { handleError } from '../utils/utils.js';
import { logger } from '../config/logger.js';
import Result from '../utils/result.js';

export default class UserService {
    async getUserByLogin(login) {
        return {};
    }

    async createUser(user) {
        logger.debug(`Starting createUser with ${JSON.stringify(user)}`);

        let response;

        try {
            const result = await UserModel.insertMany([ user ])
            response = new Result(true, 'User created successfully');
            response.userId = result[0]._id;
        }
        catch(ex) {
            response = handleError(ex, logger);
        }

        logger.debug(`Finishing createUser with response ${JSON.stringify(response)}`);
        return response;
    }
}