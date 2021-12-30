import logger from '_/utils/logger';
import { ApplicationError } from '_/errors/applicationError';
import { CustomValidationError } from './validationErrorFactory';

export function formatError(error, overrides = {}) {
	// `Error.stack`'s `enumerable` property descriptor is `false`
	// Thus, `JSON.stringify(...)` doesn't enumerate over it.
	// const stackTrace = error.stack;
	const newError = JSON.parse(JSON.stringify(error));

	// No need to send to client
	newError.statusCode = undefined;
	delete newError.meta;

	return {
		error: {
			...newError,
			// stack: stackTrace,
		},
		success: false,
		...overrides,
	};
}

export function formatResponse(result, override = {}) {
	return {
		data: result,
		success: true,
		...override,
	};
}

export function sendResponse(res, payload, statusCode = 200) {
	return res.status(statusCode).json(formatResponse(payload));
}
