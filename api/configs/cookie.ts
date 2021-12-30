import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

const cookieConfig = {
	development: {
		httpOnly: false,
		secure: false,
	},
	production: {
		httpOnly: true,
		secure: true,
	},
};

export default cookieConfig[nodeEnv];
