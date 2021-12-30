import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const nodeEnv = process.env.NODE_ENV || 'development';

const authConfig = {
	development: {
		salt: Number(env.AUTH_SALT),
		secret: env.AUTH_SECRET,
		jwtExpiration: 5, // 180 second
		jwtRefreshExpiration: 20, // 7 days
	},
};

export default authConfig[nodeEnv];
