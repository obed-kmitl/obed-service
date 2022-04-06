import { google } from 'googleapis';

import googleConfig from '_/configs/google';

export const oAuth2Client = new google.auth.OAuth2(
	googleConfig.clientId,
	googleConfig.clientSecret,
	googleConfig.callbackURL,
);
