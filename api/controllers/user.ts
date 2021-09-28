import userRepository from '_/repositories/user';
import { UserInputDTO } from '_/dtos/user';
import { sendResponse } from '_/utils/response';

import { Request, Response } from 'express';
import { deserialize } from 'json-typescript-mapper';

/**
 * Get User profile
 */
const getProfile = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req;

	const result = await userRepository.find(userId);

	sendResponse(res, result.rows[0]);
};

/**
 * Get all users
 */
const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
	const result = await userRepository.findAll();

	sendResponse(res, result.rows);
};

/**
 * Update user profile
 */
const updateProfile = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req;
	const userProfile = req.body;

	const userInfo = deserialize(UserInputDTO, {
		user_id: userId,
		...userProfile,
	});

	const userResult = await userRepository.updateUser(userInfo);

	sendResponse(res, userResult.rows[0]);
};

export default {
	getProfile,
	getAllUsers,
	updateProfile,
};
