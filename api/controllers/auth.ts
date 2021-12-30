import userRepository from '_/repositories/user';
import authConfig from '_/configs/auth';
import authToken from '_/utils/token';
import { ApplicationError } from '_/errors/applicationError';
import { sendResponse } from '_/utils/response';
import { UserInputDTO } from '_/dtos/user';
import { CommonError } from '_/errors/common';
import { AuthError } from '_/errors/auth';
import { isTeacher, isAdmin } from '_/constants/user';
import googleConfig from '_/configs/google';
import authRepository from '_/repositories/auth';
import { isExpired } from '_/utils/isExpired';
import cookieConfig from '_/configs/cookie';

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { QueryResultRow, DatabaseError } from 'pg';
import { deserialize } from 'json-typescript-mapper';
import { google } from 'googleapis';
import dayjs from 'dayjs';

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
	const refreshToken = await authToken.GenerateRefreshToken();

	await authRepository.saveOAuthRefreshToken(
		userResult.user_id,
		refreshToken,
		dayjs().add(authConfig.jwtRefreshExpiration, 'day').toString(),
	);

	// Remove unused password from userResult
	const { password: unusedPassword, ...userProfile } = userResult;

	res.cookie('accessToken', accessToken, cookieConfig);
	res.cookie('refreshToken', refreshToken, cookieConfig);
	sendResponse(res, { userProfile });
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
	const refreshToken = await authToken.GenerateRefreshToken();

	await authRepository.saveOAuthRefreshToken(
		userResult.user_id,
		refreshToken,
		dayjs().add(authConfig.jwtRefreshExpiration, 'day').toString(),
	);

	// Remove unused password from userResult
	const { password: unusedPassword, ...userProfile } = userResult;

	res.cookie('accessToken', accessToken, cookieConfig);
	res.cookie('refreshToken', refreshToken, cookieConfig);
	sendResponse(res, { userProfile });
};

/**
 * Logout with any role
 */
const logout = async (req: Request, res: Response) => {
	const { userId } = req.params;

	await authRepository.saveOAuthRefreshToken(userId, null, null);
	res.clearCookie('accessToken');
	res.clearCookie('refreshToken');
	sendResponse(res, { message: 'Logout success' });
};

/**
 * Get new accessToken using refreshToken
 */
const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
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

	res.cookie('accessToken', newAccessToken, cookieConfig);
	sendResponse(res, { message: 'Refresh token success' });
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
