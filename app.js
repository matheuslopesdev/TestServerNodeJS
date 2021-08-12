import createError from 'http-errors';
import express from 'express';

import morgan from 'morgan';
import { logStream, logger } from './config/logger.js'

import indexRouter  from './routes/index.js';
import usersRouter  from './routes/users.js';

var app = express();

app.use(morgan('[:date[iso]] method: :method | url: :url | status: :status | response time: :response-time ms', { stream: logStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', err => {
    logger.error('There was an uncaught error', err)
    logStream.end();
    process.exit(1) //mandatory (as per the Node.js docs)
});

export default app;
