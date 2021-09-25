import logger from '_/utils/logger';
import { customValidationError, ApplicationError, CommonError } from '../utils/error';
import { sendResponse, formatError } from '../utils/response';

export function errorHandler(err, req, res, next) {
	const { analytics = {} } = err.meta || {};

	if (err instanceof ApplicationError) {
		const code = err.statusCode || 500;
		const formattedError = formatError(err);
		logger.error(formattedError.error.stack);
		return res.status(code).json(formatError(err));
	}

	if (err instanceof Error) {
		const newError = customValidationError(err);
		const code = newError.statusCode || 500;
		const formattedError = formatError(newError);
		logger.error(formattedError.error.stack);
		return res.status(code).json(formatError(newError));
	}

	const unknownError = new ApplicationError(CommonError.UNKNOWN_ERROR);

	return sendResponse(res, unknownError, unknownError.statusCode);
}
