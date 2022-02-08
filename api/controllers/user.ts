import userRepository from '_/repositories/user';
import { UserInputDTO } from '_/dtos/user';
import { sendResponse } from '_/utils/response';

import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';

import { deserialize } from 'json-typescript-mapper';

/**
 * Get User profile
 */
const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const { userId } = req;

	const result = await userRepository.findUser(userId);

	sendResponse(res, result.rows[0]);
};

/**
 * Get all users
 */
const getAll = async (req: Request, res: Response, next:NextFunction): Promise<Response> => {
	const result = await userRepository.findAllUser();

	sendResponse(res, result.rows);
};

/**
 * Update user
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req.params;
	const userProfile = req.body;

	const userInfo = deserialize(UserInputDTO, {
		user_id: userId,
		...userProfile,
	});

	const userResult = await userRepository.updateUser(userInfo);

	sendResponse(res, userResult.rows[0]);
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

/**
 * Remove User
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req.params;

	const result = await userRepository.deleteUser(userId);

	sendResponse(res, result.rows[0]);
};

export default {
	getProfile,
	getAll,
	update,
	updateProfile,
	remove,
};
