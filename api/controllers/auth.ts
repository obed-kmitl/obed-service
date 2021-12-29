import userRepository from '_/repositories/user';
import authConfig from '_/configs/auth';
import authToken from '_/utils/token';
import { extractToken } from '_/utils/extractToken';
import { ApplicationError } from '_/errors/applicationError';
import { sendResponse } from '_/utils/response';
import { UserInputDTO } from '_/dtos/user';
import { CommonError } from '_/errors/common';
import { AuthError } from '_/errors/auth';
import { isTeacher, isAdmin } from '_/constants/user';
import googleConfig from '_/configs/google';

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { QueryResultRow, DatabaseError } from 'pg';
import jwt from 'jsonwebtoken';
import { deserialize } from 'json-typescript-mapper';
import { google } from 'googleapis';

/**
 * Register as TEACHER role
 */
const register = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	try {
		const user = req.body;
		// Wait for random password logic
		user.password = bcrypt.hashSync('password', authConfig.salt);
		user.role = 'TEACHER';

		const result = await userRepository.createUser(user);
		sendResponse(res, result.rows[0]);
	} catch (error) {
		if (error instanceof DatabaseError) {
			const databaseError = error as DatabaseError;
			// Check if PostgreSQL Error Codes is unique_violation (23505). See more info https://www.postgresql.org/docs/12/errcodes-appendix.html
			if (databaseError.code === '23505') {
				if (databaseError.constraint === 'users_email_key') {
					return next(new ApplicationError(AuthError.EMAIL_ALREADY_TAKEN));
				}
				if (databaseError.constraint === 'users_username_key') {
					return next(new ApplicationError(AuthError.USERNAME_ALREADY_TAKEN));
				}
			}
		}
		return next(error);
	}
};

/**
 * Register as ADMIN role
 */
const adminRegister = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	try {
		const user = req.body;
		// Wait for random password logic
		user.password = bcrypt.hashSync('password', authConfig.salt);
		user.role = 'ADMIN';

		const result = await userRepository.createUser(user);
		sendResponse(res, result.rows[0]);
	} catch (error) {
		if (error instanceof DatabaseError) {
			const databaseError = error as DatabaseError;
			// Check if PostgreSQL Error Codes is unique_violation (23505). See more info https://www.postgresql.org/docs/12/errcodes-appendix.html
			if (databaseError.code === '23505') {
				if (databaseError.constraint === 'users_email_key') {
					return next(new ApplicationError(AuthError.EMAIL_ALREADY_TAKEN));
				}
				if (databaseError.constraint === 'users_username_key') {
					return next(new ApplicationError(AuthError.USERNAME_ALREADY_TAKEN));
				}
			}
		}
		return next(error);
	}
};

/**
 * Login with TEACHER role
 */
const login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const { username, password } = req.body;

	const result = await userRepository.findUserByUsername(username);
	const userResult = result.rows[0];

	if (!userResult) {
		return next(new ApplicationError(CommonError.UNAUTHORIZED));
	}

	if (!isTeacher(userResult.role)) {
		return next(new ApplicationError(CommonError.UNAUTHORIZED));
	}

	const passwordIsValid = bcrypt.compareSync(
		password,
		userResult.password,
	);

	if (!passwordIsValid) {
		return next(new ApplicationError(CommonError.UNAUTHORIZED));
	}

	const accessToken = await authToken.GenerateAccessToken(userResult.user_id);
	const refreshToken = await authToken.GenerateRefreshToken(userResult.user_id);

	// Remove unused password from userResult
	const { password: unusedPassword, ...userProfile } = userResult;

	sendResponse(res, { userProfile, accessToken, refreshToken });
};

/**
 * Login with ADMIN role
 */
const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const { username, password } = req.body;

	const result: QueryResultRow = await userRepository.findUserByUsername(username);
	const userResult = result.rows[0];

	if (!userResult) {
		return next(new ApplicationError(CommonError.UNAUTHORIZED));
	}

	if (!isAdmin(userResult.role)) {
		return next(new ApplicationError(CommonError.UNAUTHORIZED));
	}

	const passwordIsValid = bcrypt.compareSync(
		password,
		userResult.password,
	);

	if (!passwordIsValid) {
		return next(new ApplicationError(CommonError.UNAUTHORIZED));
	}

	const accessToken = await authToken.GenerateAccessToken(userResult.user_id);
	const refreshToken = await authToken.GenerateRefreshToken(userResult.user_id);

	// Remove unused password from userResult
	const { password: unusedPassword, ...userProfile } = userResult;

	sendResponse(res, { userProfile, accessToken, refreshToken });
};

/**
 * Logout with any role
 */
const logout = async (req: Request, res: Response) => {
	const { userId } = req;
	const accessToken = extractToken(req);

	sendResponse(res, { message: 'Logout success' });
};

/**
 * Get new accessToken using refreshToken
 */
const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;

	const { refreshToken: requestToken } = req.body;

	// Validate requestToken
	if (requestToken == null) {
		return next(new ApplicationError(AuthError.REFRESH_TOKEN_IS_REQUIRED));
	}

	// Check if user exist in database
	const result = await userRepository.findUser(userId);
	const userResult = result.rows[0];

	if (!userResult) {
		return next(new ApplicationError(AuthError.USER_NOT_FOUND));
	}

	// const refreshToken = await redisClient.getAsync(userId);

	// if (!refreshToken) {
	// 	return next(new ApplicationError(CommonError.FORBIDDEN));
	// }

	try {
		await jwt.verify(requestToken, authConfig.secret);
	} catch (err) {
		return next(new ApplicationError(CommonError.FORBIDDEN));
	}

	const newAccessToken = await authToken.GenerateAccessToken(userId);

	sendResponse(res, {
		accessToken: newAccessToken,
		refreshToken: requestToken,
	});
};

/**
 * Update user password
 */
const updatePassword = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { userId } = req;
	const { oldPassword, newPassword } = req.body;

	if (oldPassword === newPassword) {
		return next(new ApplicationError(AuthError.PASSWORD_SHOULD_DIFFERENT));
	}

	const result = await userRepository.findUserWithPassword(userId);
	const userResult = result.rows[0];

	const passwordIsValid = bcrypt.compareSync(
		oldPassword,
		userResult.password,
	);

	if (!passwordIsValid) {
		return next(new ApplicationError(AuthError.INVALID_PASSWORD));
	}

	const newPasswordHash = bcrypt.hashSync(newPassword, authConfig.salt);

	const userInfo = deserialize(UserInputDTO, {
		user_id: userId,
		password: newPasswordHash,
	});

	await userRepository.updateUser(userInfo);

	sendResponse(res, { message: 'Update password success' });
};

const googleAuthToken = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { userId } = req;
	const { code } = req.body;

	const oauth2Client = new google.auth.OAuth2(
		googleConfig.clientId,
		googleConfig.secret,
		googleConfig.redirectUri,
	);
	const { tokens } = await oauth2Client.getToken(code);

	console.log(userId, tokens);

	sendResponse(res, { message: 'google auth success' });
};

export default {
	adminRegister,
	register,
	login,
	adminLogin,
	logout,
	getAccessToken,
	updatePassword,
	googleAuthToken,
};
