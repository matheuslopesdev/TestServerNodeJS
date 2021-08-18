import express from 'express';

import { expressLogger } from '../config/logger.js'

import messageRoutes  from '../routes/message.js';
import userRoutes  from '../routes/user.js';

export default class Server {
    load() {
        var app = express();

        app.use(expressLogger);
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        
        // ROUTES
        app.use('/message', messageRoutes);
        app.use('/user', userRoutes);
        
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            return res.status(404).send();
        });

        return app;
    }
}