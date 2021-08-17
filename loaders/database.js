import mongoose from 'mongoose';
import { logger } from '../config/logger.js';

export default class Database {
    async load() {
        mongoose.set('debug', function(collection, method, ...args) {           
            logger.database(`collection: ${collection} | method: ${method} | args: ${JSON.stringify(args)}`);
        });
        await mongoose.connect(process.env.DATABASE_URL);
        
    }
}
