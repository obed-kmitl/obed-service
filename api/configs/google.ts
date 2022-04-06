import dotenv from 'dotenv';

dotenv.config();

const { env } = process;
const nodeEnv = process.env.NODE_ENV || 'development';

const googleConfig = {
	development: {
		clientId: env.GOOGLE_CLIENT_ID || '1075818370617-olki93anh4mfpcasj4chcb9seci5leqj.apps.googleusercontent.com',
		clientSecret: env.GOOGLE_CLIENT_SECRET || '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',
		callbackURL: env.GOOGLE_CALLBACK_URI || 'http://localhost:3000',
	},
};

export default googleConfig[nodeEnv];
