import express, { Request, Response } from 'express';
import logger from '_/middleware/logger';
import { UserRepository } from './repositories';

class Server {
	private app: express. Application;

	constructor() {
	  this.app = express(); // init the application
	  this.configuration();
	  this.routes();

		const userRepository = new UserRepository();
		// userRepository.createUser();
		userRepository.findAllTeachers();
	}

	/**
	 * Method to configure the server,
	 * If we  didnt configure the port into the environment
	 * variables it takes the default port 3000
	 */
	public configuration() {
	  this.app.set('port', process.env.PORT || 3001);
	}

	/**
	 * Method to configure the routes
	 */
	public async routes() {
	  this.app.get('/', (req: Request, res: Response) => {
	    res.send('Hello world!');
	  });
	}

	/**
	 * Used to start the server
	 */
	public start() {
	  this.app.listen(this.app.get('port'), () => {
	    logger.info(`Server is listening ${this.app.get('port')} port.`);
	  });
	}
}

const server = new Server(); // Create server instance
server.start();
