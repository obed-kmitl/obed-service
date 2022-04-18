import 'reflect-metadata';
import logger from '_/utils/logger';
import routes from '_/routes';
import { errorHandler } from '_/middleware/errorHandler';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { version } from '../package.json';

const server = express(); // init the application

/**
 * Method to configure the server,
 * If we  didnt configure the port into the environment
 * variables it takes the default port 3001.
 */
server.set('port', process.env.PORT || 3001);
server.set('view engine', 'ejs');

// middileware
server.use(express.json());

// Allow cookie parser
server.use(cookieParser());

// Allow cors policy
server.use(cors({
	origin: true,
	credentials: true,
}));

/**
 * API health check
 */
server.use('/health-check', (req, res) => {
	res.send(`I'm up and running on v${version}.`);
});

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
