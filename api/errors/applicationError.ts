export class ApplicationError extends Error {
	public type?: string;

	public code?: string;

	public meta?: Object;

	public statusCode?: number;

	static errorType = {
		APP_OBED_SERVICE: 'APP_OBED_SERVICE',
		INTERNAL: 'INTERNAL',
		NETWORK: 'NETWORK',
		UNKNOWN: 'UNKNOWN',
	};

	constructor(options, overrides = {}) {
		super();
		Object.assign(options, overrides);

		// eslint-disable-next-line no-prototype-builtins
		if (!ApplicationError.errorType.hasOwnProperty(options.type)) {
			throw new Error(`ApplicationError: ${options.type} is not a valid type.`);
		}

		if (!options.message) {
			throw new Error('ApplicationError: error message required.');
		}

		if (!options.code) {
			throw new Error('ApplicationError: error code required.');
		}

		this.name = 'ApplicationError';
		this.type = options.type;
		this.code = options.code;
		this.message = options.message;
		this.meta = options.meta;
		this.statusCode = options.statusCode;
	}
}
