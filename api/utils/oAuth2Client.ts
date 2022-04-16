import { classroom_v1, google } from 'googleapis';
import { Request, NextFunction } from 'express';
import { size } from 'lodash';

import googleConfig from '_/configs/google';
import { googleRepository } from '_/repositories';
import { ApplicationError } from '_/errors/applicationError';
import { GoogleError } from '_/errors/google';

export const oAuth2Client = new google.auth.OAuth2(
	googleConfig.clientId,
	googleConfig.clientSecret,
	googleConfig.callbackURL,
);

export const classroomOAuth2Client = async (
	req: Request, next: NextFunction,
):Promise<classroom_v1.Classroom> => {
	const { userId } = req;
	const { rows } = await googleRepository.getCredentials(userId);
	if (size(rows) === 0) {
		return next(new ApplicationError(GoogleError.CREDENTAILS_NOT_FOUND));
	}
	const credentials = rows[0];
	oAuth2Client.setCredentials(credentials);

	return google.classroom({ version: 'v1', auth: oAuth2Client });
};
