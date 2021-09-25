import logger from '_/utils/logger';
import { ApplicationError, customValidationError } from './error';

export function formatError(error, overrides = {}) {
	// `Error.stack`'s `enumerable` property descriptor is `false`
	// Thus, `JSON.stringify(...)` doesn't enumerate over it.
	const stackTrace = error.stack;
	const newError = JSON.parse(JSON.stringify(error));

	// No need to send to client
	newError.statusCode = undefined;
	delete newError.meta;

	return {
		error: {
			...newError,
			stack: stackTrace,
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

export function sendResponse(res, payload, statusCode = 200, context = {}) {
	if (payload instanceof ApplicationError) {
		const code = payload.statusCode || 500;
		const formattedError = formatError(payload);
		logger.error(formattedError.error.stack);
		return res.status(code).json(formattedError);
	}

	if (payload instanceof Error) {
		const newError = customValidationError(payload);
		const code = newError.statusCode || 500;
		const formattedError = formatError(newError);
		logger.error(formattedError.error.stack);
		return res.status(code).json(formattedError);
	}

	return res.status(statusCode).json(formatResponse(payload));
}
