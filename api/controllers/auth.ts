import userRepository from '_/repositories/user';
import { UserInputDTO } from '_/dtos/user';
import authConfig from '_/config/auth';
import authToken from '_/utils/token';
import redisClient from '_/utils/redis';
import { extractToken } from '_/utils/extractToken';
import { customValidationError } from '_/utils/error';

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { QueryResultRow } from 'pg';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';

/**
 * Register as TEACHER role
 */
const register = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	try {
		const user = new UserInputDTO({
			email:	req.body.email,
			username:	req.body.username,
			password:	bcrypt.hashSync('password', authConfig.salt),
			prefix:	req.body.prefix,
			firstname:	req.body.firstname,
			lastname:	req.body.lastname,
			role: ['TEACHER'],
		});

		validate(user).then((errors) => {
			if (errors.length > 0) {
				next(customValidationError(errors[0]));
			}
		});

		// const result = await userRepository.createUser(user);
		// return res.status(200).json({ data: result.rows[0] });
	} catch (error) {
		return next(customValidationError(error));
	}
};

/**
 * Login with TEACHER role
 */
const login = async (req: Request, res: Response): Promise<Response> => {
	const { username, password } = req.body;

	const result = await userRepository.findByUsername(username);
	const userResult = result.rows[0];

	if (!userResult) {
		return res.status(404).send({ message: 'User Not found.' });
	}

	if (!userResult.role.includes('TEACHER')) {
		return res.status(401).send({
			message: 'No permission!',
		});
	}

	const passwordIsValid = bcrypt.compareSync(
		password,
		userResult.password,
	);

	if (!passwordIsValid) {
		return res.status(401).send({
			accessToken: null,
			message: 'Invalid Password!',
		});
	}

	const accessToken = await authToken.GenerateAccessToken(userResult.user_id);
	const refreshToken = await authToken.GenerateRefreshToken(userResult.user_id);

	return res.status(200).json({ data: { accessToken, refreshToken } });
};

/**
 * Login with ADMIN role
 */
const adminLogin = async (req: Request, res: Response): Promise<Response> => {
	const { username, password } = req.body;

	const result: QueryResultRow = await userRepository.findByUsername(username);

	if (!result) {
		return res.status(404).send({ message: 'User Not found.' });
	}

	if (!result.role.includes('ADMIN')) {
		return res.status(401).send({
			message: 'No permission!',
		});
	}

	const passwordIsValid = bcrypt.compareSync(
		password,
		result.password,
	);

	if (!passwordIsValid) {
		return res.status(401).send({
			message: 'Invalid Password!',
		});
	}

	const accessToken = await authToken.GenerateAccessToken(result.user_id);
	const refreshToken = await authToken.GenerateRefreshToken(result.user_id);

	return res.status(200).json({ data: { accessToken, refreshToken } });
};

/**
 * Logout with any role
 */
const logout = async (req: Request, res: Response) => {
	const { userId } = req;
	const accessToken = extractToken(req);

	// remove the refresh token
	await redisClient.del(userId.toString());

	// blacklist current access token
	await redisClient.setAsync(`BL_${userId.toString()}`, accessToken);

	return res.status(200).json({ message: 'Logout Success' });
};

/**
 * Get new accessToken using refreshToken
 */
const getAccessToken = async (req: Request, res: Response) => {
	const { userId } = req.params;

	const { refreshToken: requestToken } = req.body;

	if (requestToken == null) {
		return res.status(403).json({ message: 'Refresh Token is required!' });
	}

	const refreshToken = await redisClient.getAsync(userId);

	if (!refreshToken) {
		return res.status(403).json({ message: 'Refresh token is not in cache!' });
	}

	try {
		await jwt.verify(requestToken, authConfig.secret);
	} catch (err) {
		return res.status(403).json({
			message: 'Refresh token was expired. Please make a new signin request',
		});
	}

	const newAccessToken = await authToken.GenerateAccessToken(userId);

	return res.status(200).json({
		data: {
			accessToken: newAccessToken,
			refreshToken: requestToken,
		},
	});
};

/**
 * Update user password
 */
const updatePassword = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req;
	const { oldPassword, newPassword } = req.body;

	const result = await userRepository.findWithPassword(userId);
	const userResult = result.rows[0];

	if (!userResult) {
		return res.status(404).send({ message: 'User Not found.' });
	}

	if (oldPassword === newPassword) {
		return res.status(401).send({
			message: 'Duplicated Password!',
		});
	}

	const passwordIsValid = bcrypt.compareSync(
		oldPassword,
		userResult.password,
	);

	if (!passwordIsValid) {
		return res.status(401).send({
			message: 'Invalid Password!',
		});
	}

	const newPasswordHash = bcrypt.hashSync(newPassword, authConfig.salt);

	const userProfile = new UserInputDTO({
		user_id: userId,
		password: newPasswordHash,
	});

	await userRepository.updateUser(userProfile);

	return res.status(200).json({ message: 'Update password success' });
};

export default {
	register,
	login,
	adminLogin,
	logout,
	getAccessToken,
	updatePassword,
};
