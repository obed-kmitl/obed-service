import { sendResponse } from '_/utils/response';
import { cloRepository } from '_/repositories';

import { Request, Response } from 'express';

/**
 * Create Course Learning Outcome
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await cloRepository.create(req.body);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
};
