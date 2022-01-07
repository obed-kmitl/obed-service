import { sendResponse } from '_/utils/response';
import { activityRepository } from '_/repositories';

import { Request, Response } from 'express';

/**
 * Create Activity
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await activityRepository.create(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Create Category
 */
const createCategory = async (req: Request, res: Response): Promise<Response> => {
	const result = await activityRepository.createCategory(req.body);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	createCategory,
};
