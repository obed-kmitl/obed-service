import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const nodeEnv = process.env.NODE_ENV || 'development';

const authConfig = {
	development: {
		salt: Number(env.AUTH_SALT),
		secret: env.AUTH_SECRET,
		jwtExpiration: 180, // 180 second
		jwtRefreshExpiration: 7, // 7 days
	},
};

export default authConfig[nodeEnv];
