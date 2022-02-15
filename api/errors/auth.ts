import { ApplicationError } from '_/errors/applicationError';

export const AuthError = {
	EMAIL_ALREADY_TAKEN: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'EMAIL_ALREADY_TAKEN',
		message: 'The given email address is already taken',
		statusCode: 400,
	},
	USERNAME_ALREADY_TAKEN: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'USERNAME_ALREADY_TAKEN',
		message: 'The given username is already taken',
		statusCode: 400,
	},
	REFRESH_TOKEN_IS_REQUIRED: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'REFRESH_TOKEN_IS_REQUIRED',
		message: 'Refresh Token is required',
		statusCode: 401,
	},
	REFRESH_TOKEN_IS_EXPIRED: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'REFRESH_TOKEN_IS_EXPIRED',
		message: 'Refresh Token is expired',
		statusCode: 401,
	},
	REFRESH_TOKEN_NOT_FOUND: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'REFRESH_TOKEN_NOT_FOUND',
		message: 'Refresh Token not found',
		statusCode: 401,
	},
	INVALID_PASSWORD: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'INVALID_PASSWORD',
		message: 'Invalid password',
		statusCode: 403,
	},
	TOKEN_EXPIRED: {
		type: ApplicationError.errorType.NETWORK,
		code: 'TOKEN_EXPIRED',
		message: 'Unauthorized Access Token was expired',
		statusCode: 401,
	},
	ACCESS_TOKEN_IS_REQUIRED: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'ACCESS_TOKEN_IS_REQUIRED',
		message: 'Access Token is required',
		statusCode: 401,
	},
	ACCESS_TOKEN_IS_NOT_BEARER: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'ACCESS_TOKEN_IS_NOT_BEARER',
		message: 'Access Token is not bearer',
		statusCode: 401,
	},
	USER_NOT_FOUND: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'USER_NOT_FOUND',
		message: 'User not found',
		statusCode: 404,
	},
	NO_PERMISSION: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'NO_PERMISSION',
		message: 'No Permission',
		statusCode: 401,
	},
	PASSWORD_SHOULD_DIFFERENT: {
		type: ApplicationError.errorType.APP_OBED_SERVICE,
		code: 'PASSWORD_SHOULD_DIFFERENT',
		message: 'Password should not be the same',
		statusCode: 400,
	},
};
