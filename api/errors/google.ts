import { ApplicationError } from '_/errors/applicationError';

export const GoogleError = {
	CREDENTAILS_NOT_FOUND: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'CREDENTAILS_NOT_FOUND',
		message: 'Google credentials not found.',
		statusCode: 404,
	},
	UNAUTHORIZED: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'UNAUTHORIZED',
		message: 'Unauthorized be google.',
		statusCode: 500,
	},
	GOOGLE_CLASSROOM_API_ERROR: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'GOOGLE_ERROR',
		message: 'Google classroom API error.',
		statusCode: 500,
	},
};
