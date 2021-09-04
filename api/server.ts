import express, { Request, Response } from 'express';
import logger from '_/middleware/logger';
import { userRepository } from './repositories';

const server = express(); // init the application

// userRepository.createUser();
userRepository.findAllTeachers();

/**
 * Method to configure the server,
 * If we  didnt configure the port into the environment
 * variables it takes the default port 3000
 */
server.set('port', process.env.PORT || 3001);

/**
 * Method to configure the routes
 */
server.get('/', (req: Request, res: Response) => {
	res.send('Hello world!');
});
// server.use('/obed/api', controllers);

/**
 * Used to start the server
 */
server.listen(server.get('port'), () => {
	logger.info(`Server is listening ${server.get('port')} port.`);
});
