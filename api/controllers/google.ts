import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { get, size } from 'lodash';

import { sendResponse } from '_/utils/response';
import { oAuth2Client } from '_/utils/oAuth2Client';
import { googleRepository } from '_/repositories';
import { GoogleAuthorizationRequestDTO } from '_/dtos/google';

export const listCourseWorks = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req;
};

export const listCourses = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req;
	const { rows } = await googleRepository.getCredentials(userId);
	console.log(userId, rows);
	if (size(rows) === 0) {
		sendResponse(res, []);
	}
	const credentials = rows[0];
	oAuth2Client.setCredentials(credentials);

	const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });
	classroom.courses.list({
	}, (err, result) => {
		if (err) return console.error(`The API returned an error: ${err}`);
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

	// oAuth2Client.setCredentials(result.tokens);

	// console.log(result);

	sendResponse(res, { message: 'Authorization Success' });
};
