import authConfig from '_/configs/auth';
import userRepository from '_/repositories/user';
import { AuthError } from '_/errors/auth';
import { ApplicationError } from '_/errors/applicationError';
import { CommonError } from '_/errors/common';
import { isPermitRole } from '_/constants/user';
import authToken, { extractBearer } from '_/utils/token';
import authRepository from '_/repositories/auth';
import { isExpired } from '_/utils/isExpired';

import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';

const { TokenExpiredError } = jwt;

export const verifyToken = async (req:Request, res:Response, next:NextFunction) : Response => {
	const { accessToken } = req.cookies;

	if (!accessToken) {
		return next(new ApplicationError(AuthError.ACCESS_TOKEN_IS_REQUIRED));
	}

	const token = extractBearer(accessToken);

	if (!token) {
		return next(new ApplicationError(AuthError.ACCESS_TOKEN_IS_NOT_BEARER));
	}

	try {
		const decoded = jwt.verify(token, authConfig.secret);
		req.userId = decoded.id;

		next();
	} catch (err) {
		if (err instanceof TokenExpiredError) {
			const { refreshToken } = req.cookies;

			// Validate refreshToken
			if (refreshToken == null) {
				return next(new ApplicationError(AuthError.REFRESH_TOKEN_IS_REQUIRED));
			}

			const result = await authRepository.findOAuthRefreshToken(refreshToken);

			// Check if refresh token not found
			if (result.rows.length === 0) {
				return next(new ApplicationError(AuthError.REFRESH_TOKEN_NOT_FOUND));
			}

			// Check if refresh token is expired
			if (isExpired(result.rows[0].expired_at)) {
				return next(new ApplicationError(AuthError.REFRESH_TOKEN_IS_EXPIRED));
			}

			// Generate new access token from useId
			const newAccessToken = await authToken.GenerateAccessToken(result.rows[0].user_id);

			// Extend refresh token expired time
			await authRepository.saveOAuthRefreshToken(
				result.rows[0].user_id,
				refreshToken,
				dayjs().add(authConfig.jwtRefreshExpiration, 'day').toString(),
			);

			res.cookie('accessToken', newAccessToken, { httpOnly: true });

			req.userId = result.rows[0].user_id;
			return next();
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

	const hasPermission = permittedRoles.find(
		(permitRole) => isPermitRole(userResult.role, permitRole),
	);

	if (!hasPermission) {
		return next(new ApplicationError(AuthError.NO_PERMISSION));
	}
	next(); // role is allowed, so continue on the next middleware
};

export default {
	verifyToken,
	permit,
};
