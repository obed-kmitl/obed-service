import express from 'express';
import logger from '_/utils/logger';
import routes from '_/routes';
import cors from 'cors';

import { errorHandler } from '_/middleware/errorHandler';

const server = express(); // init the application

/**
 * Method to configure the server,
 * If we  didnt configure the port into the environment
 * variables it takes the default port 3000
 */
server.set('port', process.env.PORT || 3001);

// middileware
server.use(express.json());

// Allow cors policy
server.use(cors());

/**
 * Method to configure the routes
 */
server.use('/obed/api', routes);

server.use(errorHandler);

/**
 * Used to start the server
 */
server.listen(server.get('port'), () => {
	logger.info(`Server is listening ${server.get('port')} port.`);
});
