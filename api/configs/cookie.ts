import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

const cookieConfig = {
	development: {
		httpOnly: false,
		secure: false,
	},
	production: {
		httpOnly: false,
		secure: false,
	},
};

export default cookieConfig[nodeEnv];
