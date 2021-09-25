import userRepository from '_/repositories/user';
import { UserInputDTO } from '_/dtos/user';
import { Request, Response } from 'express';

/**
 * Get User profile
 */
const getProfile = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req;

	const result = await userRepository.find(userId);

	return res.status(200).json({ data: result.rows[0] });
};

/**
 * Get all users
 */
const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
	const result = await userRepository.findAll();

	return res.status(200).json({ data: result.rows });
};

/**
 * Update user profile
 */
const updateProfile = async (req: Request, res: Response): Promise<Response> => {
	const { userId } = req;

	const userProfile = new UserInputDTO({
		user_id: userId,
		email: req.body.email,
		username: req.body.username,
		prefix: req.body.prefix,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		g_auth_code: req.body.g_auth_code,
		role: req.body.role,
		created_at: req.body.created_at,
		updated_at: req.body.updated_at,
	});

	const result = await userRepository.updateUser(userProfile);

	return res.status(200).json({ data: result.rows[0] });
};

export default {
	getProfile,
	getAllUsers,
	updateProfile,
};
