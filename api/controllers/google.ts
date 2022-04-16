import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { get, size } from 'lodash';

import { sendResponse } from '_/utils/response';
import { oAuth2Client } from '_/utils/oAuth2Client';
import { googleRepository } from '_/repositories';
import { GoogleAuthorizationRequestDTO } from '_/dtos/google';
import { ApplicationError } from '_/errors/applicationError';
import { GoogleError } from '_/errors/google';

export const listCourseWorks = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req;
	const { courseId } = req.params;
	const { rows } = await googleRepository.getCredentials(userId);
	if (size(rows) === 0) {
		return next(new ApplicationError(GoogleError.CREDENTAILS_NOT_FOUND));
	}
	const credentials = rows[0];
	oAuth2Client.setCredentials(credentials);

	const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
	classroom.courses.courseWork.list({ courseId }, (err, result) => {
		if (err) return next(new ApplicationError(GoogleError.GOOGLE_CLASSROOM_API_ERROR));
		sendResponse(res, get(result, 'data.courseWork'));
	});
};

export const listCourses = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req;
	const { rows } = await googleRepository.getCredentials(userId);
	if (size(rows) === 0) {
		return next(new ApplicationError(GoogleError.CREDENTAILS_NOT_FOUND));
	}
	const credentials = rows[0];
	oAuth2Client.setCredentials(credentials);

	const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
	classroom.courses.list({
		teacherId: 'me',
	}, (err, result) => {
		if (err) return next(new ApplicationError(GoogleError.GOOGLE_CLASSROOM_API_ERROR));
		sendResponse(res, get(result, 'data.courses'));
	});
};

export const authorize = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { userId, code } = req.body as GoogleAuthorizationRequestDTO;

	const result = await oAuth2Client.getToken(code);

	await googleRepository.upsert(
		{
			user_id: userId,
			...result.tokens,
		},
	);

	sendResponse(res, { message: 'Authorization Success' });
};
