import { ApplicationError } from './applicationError';

const SemesterError = {
	INVALID_YEAR_NUMBER: {
		type: ApplicationError.errorType.NETWORK,
		code: 'BAD_REQUEST',
		message: 'Year number should not be more than two years from now.',
		statusCode: 400,
	},
};

export { SemesterError };
