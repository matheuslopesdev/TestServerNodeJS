import express from 'express';
import createError from 'http-errors';

import { expressLogger } from '../config/logger.js'

import indexRoutes  from '../routes/index.js';
import userRoutes  from '../routes/user.js';

export default class Server {
    load() {
        var app = express();

        app.use(expressLogger);
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        
        // ROUTES
        app.use('/', indexRoutes);
        app.use('/user', userRoutes);
        
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            next(createError(404));
        });
        
        // error handler
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            
            console.log(JSON.stringify(res.locals));
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

        return app;
    }
}