import userRepository from '_/repositories/user';
import {
	UserInputDTO,
	UserOutputDTO,
	UserDTO,
} from '_/dtos/user';
import authConfig from '_/config/auth';
import authToken from '_/utils/token';
import redisClient from '_/utils/redis';

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { QueryResultRow } from 'pg';
import jwt from 'jsonwebtoken';

/**
 * Register as TEACHER role
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @returns {Response} HTTP response
 */
const register = async (req: Request, res: Response): Promise<Response> => {
	const userInfoInput = new UserInputDTO(
		req.body.email,
		req.body.username,
		bcrypt.hashSync(req.body.password, authConfig.salt),
		req.body.prefix,
		req.body.firstname,
		req.body.lastname,
		['TEACHER'],
	);

	const result = await userRepository.create(userInfoInput);

	const user = new UserOutputDTO(
		result.user_id,
		result.email,
		result.username,
		result.prefix,
		result.firstname,
		result.lastname,
		result.g_auth_co,
		result.role,
		result.created_at,
		result.updated_at,
	);

	return res.status(200).json({ success: true, message: 'Register Success', data: user });
};

/**
 * Login and verify TEACHER role from middleware
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @returns {Response} HTTP response
 */
const login = async (req: Request, res: Response): Promise<Response> => {
	const usernameInput: string = req.body.username;

	const result: QueryResultRow = await userRepository.findOneByUsername(usernameInput);

	const user = new UserDTO(
		result.user_id,
		result.email,
		result.username,
		result.password,
		result.prefix,
		result.firstname,
		result.lastname,
		result.g_auth_co,
		result.role,
		result.created_at,
		result.updated_at,
	);

	if (!user) {
		return res.status(404).send({ message: 'User Not found.' });
	}

	const passwordIsValid = bcrypt.compareSync(
		req.body.password,
		user.password,
	);

	if (!passwordIsValid) {
		return res.status(401).send({
			accessToken: null,
			message: 'Invalid Password!',
		});
	}

	const accessToken = await authToken.GenerateAccessToken(user.user_id);
	const refreshToken = await authToken.GenerateRefreshToken(user.user_id);

	return res.status(200).json({ success: true, message: 'Login Success', data: { accessToken, refreshToken } });
};

/**
 * Logout with any role
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @returns {Response} HTTP response
 */
const logout = async (req: Request, res: Response) => {
	const { userId } = req.body;
	const { authorization } = req.headers;

	// remove the refresh token
	await redisClient.del(userId.toString());

	// blacklist current access token
	await redisClient.setAsync(`BL_${userId.toString()}`, authorization.split(' ')[1]);

	return res.json({ success: true, message: 'Logout Success.' });
};

/**
 * Get new accessToken using refreshToken
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @returns {Response} HTTP response
 */
const getAccessToken = async (req: Request, res: Response) => {
	const { user_id: userId, refreshToken: requestToken } = req.body;

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
		accessToken: newAccessToken,
		refreshToken: requestToken,
	});
};

export default {
	register,
	login,
	logout,
	getAccessToken,
};
