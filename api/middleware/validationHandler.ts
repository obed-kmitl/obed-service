import { Validator } from 'class-validator';
import { instanceToPlain } from 'class-transformer';
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
interface ValidateResult {
  target?: Record<string, unknown>;
  value: number;
  property: string;
  children: {
    constraints: { [type: string]: string };
  }[];
  constraints: { [type: string]: string };
}

const validateConstraints = (payload, property = '', resultArray: string[] = []) => {
	if (payload.children && payload.children.length > 0) {
		payload.children.forEach((child) => validateConstraints(child, payload.property, resultArray));
		return resultArray;
	}
	const errorArray = Object.values(payload.constraints).map(
		(errString) => `${property ? `${property}.` : ''}${errString}`,
	);
	resultArray.push(...errorArray);
	return resultArray;
};

export const customValidateSync = (payloadClass): string[] => {
	const validator = new Validator();
	try {
		const errors = validator.validateSync(payloadClass);
		let resultArray: any[] = [];
		const plainErrors = instanceToPlain(errors);
		plainErrors.forEach((each: ValidateResult) => {
			resultArray = resultArray.concat(validateConstraints(each));
		});
		return resultArray;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export default {
	validateRequest,
	customValidateSync,
};
