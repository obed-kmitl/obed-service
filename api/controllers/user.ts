import userRepository from '_/repositories/user';
import {
	UserOutputDTO,
	UserArrayOutputDTO,
	UserDTO,
} from '_/dtos/user';

import { Request, Response } from 'express';
import { QueryResultRow } from 'pg';

const getProfile = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req;

	const result : QueryResultRow = await userRepository.find(userId);

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

	return res.status(200).json({ success: true, data: user });
};

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
	const result : QueryResultRow = await userRepository.findAll();

	const users = new UserArrayOutputDTO(result as UserOutputDTO[]);

	return res.status(200).json({ success: true, data: users });
};

const updateProfile = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req;

	const userProfile = new UserDTO(
		userId,
		req.body.email || null,
		req.body.username || null,
		req.body.password || null,
		req.body.prefix || null,
		req.body.firstname || null,
		req.body.lastname || null,
		req.body.g_auth_code || null,
		req.body.role || null,
		req.body.created_at || null,
		req.body.updated_at || null,
	);

	await userRepository.updateUser(userProfile);

	return res.status(200).json({ success: true, message: 'Update profile success!' });
};

export default {
	getProfile,
	getAllUsers,
	updateProfile,

};
