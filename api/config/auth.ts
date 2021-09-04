import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const nodeEnv = process.env.NODE_ENV || 'development';

const authConfig = {
	development: {
		secret: env.AUTH_SECRET,
		// jwtExpiration: 3600,         // 1 hour
		// jwtRefreshExpiration: 86400, // 24 hours

		/* for test */
		jwtExpiration: 60, // 1 minute
		jwtRefreshExpiration: 120, // 2 minutes
	},
};

export default authConfig[nodeEnv];
