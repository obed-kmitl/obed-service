import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const nodeEnv = process.env.NODE_ENV || 'development';

const redisConfig = {
	development: {
		host: env.REDIS_HOST,
		port: env.REDIS_PORT,
	},
};

export default redisConfig[nodeEnv];
