import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const nodeEnv = process.env.NODE_ENV || 'development';

const dbConfig = {
	development: {
		user: env.DB_USER,
		host: env.DB_HOST,
		password: env.DB_PASSWORD,
		database: env.DB_DATABASE,
		port: env.DB_PORT,
	},
	production: {
		user: env.DB_USER,
		host: env.DB_HOST,
		password: env.DB_PASSWORD,
		database: env.DB_DATABASE,
		port: env.DB_PORT,
	},
};

export default dbConfig[nodeEnv];
