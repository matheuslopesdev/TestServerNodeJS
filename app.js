import { logger } from './config/logger.js'

import EnvironmentVariablesLoader from './loaders/EnvironmentVariables.js';
import DatabaseLoader from './loaders/database.js';
import ServerLoader from './loaders/server.js';
import AuthLoader from './loaders/auth.js';

//Loaders
await new EnvironmentVariablesLoader().load();
await new DatabaseLoader().load();
var app = new ServerLoader().load();
await new AuthLoader().load();

process.on('uncaughtException', err => {
    logger.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node.js docs)
});

export default app;