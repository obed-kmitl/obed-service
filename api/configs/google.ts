import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const nodeEnv = process.env.NODE_ENV || 'development';

const googleConfig = {
	development: {
		clientId: env.GOOGLE_CLIENT_ID || '',
		clientSecret: env.GOOGLE_CLIENT_SECRET || '',
		callbackURL: env.GOOGLE_CALLBACK_URI || '',
	},
	production: {
		clientId: env.GOOGLE_CLIENT_ID || '',
		clientSecret: env.GOOGLE_CLIENT_SECRET || '',
		callbackURL: env.GOOGLE_CALLBACK_URI_PROD || '',
	},
};

export default googleConfig[nodeEnv];
