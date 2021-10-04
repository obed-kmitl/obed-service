import authConfig from '_/config/auth';
import userRepository from '_/repositories/user';
import { extractToken } from '_/utils/extractToken';
import { AuthError } from '_/errors/auth';
import { ApplicationError } from '_/errors/applicationError';
import { CommonError } from '_/errors/common';
import redisClient from '_/utils/redis';

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { access } from 'fs';

const { TokenExpiredError } = jwt;

export const verifyToken = async (req:Request, res:Response, next:NextFunction) : Response => {
	const accessToken = extractToken(req);

	if (!accessToken) {
		return next(new ApplicationError(AuthError.ACCESS_TOKEN_IS_REQUIRED));
	}

	try {
		const decoded = jwt.verify(accessToken, authConfig.secret);
		req.userId = decoded.id;

		// Check if accessToken is in blacklist cache should return an error
		const accessTokenBL = await redisClient.getAsync(`BL_${decoded.id.toString()}`);
		if (accessTokenBL === accessToken) {
			return next(new ApplicationError(CommonError.UNAUTHORIZED));
		}

		next();
	} catch (err) {
		if (err instanceof TokenExpiredError) {
			return next(new ApplicationError(AuthError.TOKEN_EXPIRED));
		}

		return next(new ApplicationError(CommonError.UNAUTHORIZED));
	}
};

export const permit = (...permittedRoles: String[]) => async (
	req:Request, res:Response, next:NextFunction,
) => {
	const { userId } = req;

	const result = await userRepository.findUser(userId);
	const userResult = result.rows[0];

	if (!userResult) {
		return next(new ApplicationError(AuthError.USER_NOT_FOUND));
	}

	const hasPermission = permittedRoles.find((val) => userResult.roles.includes(val));

	if (!hasPermission) {
		return next(new ApplicationError(AuthError.NO_PERMISSION));
	}
	next(); // role is allowed, so continue on the next middleware
};

export default {
	verifyToken,
	permit,
};
