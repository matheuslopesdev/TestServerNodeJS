import UserModel from '../models/user.js';
import { handleError } from '../utils/utils.js';
import { logger } from '../config/logger.js';
import Result from '../utils/result.js';

export default class UserService {
    static #instance;

    static getInstance() {
        if(!this.#instance) {
            this.#instance = new UserService();
        }

        return this.#instance;
    }

    async getUserByLogin(login) {
        logger.debug(`Starting UserService.getUserByLogin with ${JSON.stringify(login)}`);
        
        let result;

        try {
            const dbResponse = await UserModel.findByLogin(login);
            result = new Result(!!dbResponse, dbResponse);
        }
        catch(ex) {
            result = handleError(ex, logger);
        }

        logger.debug(`Finishing UserService.getUserByLogin with response ${JSON.stringify(result)}`);
        return result;
    }

    async createUser(user) {
        logger.debug(`Starting UserService.createUser with ${JSON.stringify(user)}`);

        let result;

        try {
            const dbResponse = await UserModel.insertMany([ user ])
            result = new Result(true, 'User created successfully');
            result.userId = dbResponse[0]._id;
        }
        catch(ex) {
            result = handleError(ex, logger);
        }

        logger.debug(`Finishing UserService.createUser with response ${JSON.stringify(result)}`);
        return result;
    }

    async updateUser(login, user) {
        logger.debug(`Starting UserService.updateUser with ${JSON.stringify(user)}`);

        let result;

        try {
            await UserModel.updateOne({ $or: [{ username: login },{ email: login }]}, user);
            result = new Result(true, 'User updated successfully');
        }
        catch(ex) {
            result = handleError(ex, logger);
        }

        logger.debug(`Finishing UserService.updateUser with response ${JSON.stringify(result)}`);
        return result;
    }

    async deleteUser(login) {
        logger.debug(`Starting UserService.deleteUser with ${JSON.stringify(login)}`);

        let result;

        try {
            await UserModel.deleteOne({ $or: [{ username: login },{ email: login }]});
            result = new Result(true, 'User deleted successfully');
        }
        catch(ex) {
            result = handleError(ex, logger);
        }

        logger.debug(`Finishing UserService.deleteUser with response ${JSON.stringify(result)}`);
        return result;
    }
}