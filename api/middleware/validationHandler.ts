import { Validator } from 'class-validator';
import {
	RequestHandler, Request, Response, NextFunction,
} from 'express';
import { CustomValidationError } from '_/utils/validationErrorFactory';
import { deserialize } from 'json-typescript-mapper';

// See more example from here https://www.worl.co/2016/12/building-an-api-backend-with-typescript-and-express---part-two-validation/

// Because all type information is erased in the compiled
// JavaScript, we can use this clever structural-typing
// work-around enabled by TypeScript to pass in a class
// to our middleware.
type Constructor<T> = {new(): T};

// This function returns a middleware which validates that the
// request's JSON body conforms to the passed-in type.
export function validateRequest<T extends object>(type: Constructor<T>): RequestHandler {
	const validator = new Validator();

	return (req: Request, res: Response, next: NextFunction) => {
		const input = deserialize(type, req.body);

		const validateErrors = validator.validateSync(input);
		if (validateErrors.length > 0) {
			next(CustomValidationError(validateErrors[0]));
		} else {
			req.body = input;
			next();
		}
	};
}

export default {
	validateRequest,
};
