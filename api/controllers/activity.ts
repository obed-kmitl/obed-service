import { sendResponse } from '_/utils/response';
import { activityRepository } from '_/repositories';
import { UpdateActivityRequestDTO } from '_/dtos/activity';

import { Request, Response } from 'express';

/**
 * Create Activity
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await activityRepository.create(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Get All activity by section
 */
const getAllBySection = async (req: Request, res: Response): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await activityRepository.getAllBySection(sectionId);

	sendResponse(res, result);
};

/**
 * Update Activity
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const updateActivityRequestDTO: UpdateActivityRequestDTO = {
		...req.body,
	};
	const result = await activityRepository.update(updateActivityRequestDTO, activityId);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Activity
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const result = await activityRepository.remove(activityId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	getAllBySection,
	update,
	remove,
};
