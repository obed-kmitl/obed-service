import semesterRepository from '_/repositories/semester';
import { sendResponse } from '_/utils/response';

import { Request, Response } from 'express';

/**
 * Create Semester
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await semesterRepository.createSemester(req.body);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
};
