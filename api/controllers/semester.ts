import semesterRepository from '_/repositories/semester';
import { sendResponse } from '_/utils/response';

import { Request, Response } from 'express';

/**
 * Create Semester
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await semesterRepository.createSemester(req.body);

	sendResponse(res, result.rows);
};

/**
 * Create multiple group sections
 */
const createGroupSections = async (req: Request, res: Response): Promise<Response> => {
	const { semesterId } = req.params;
	const mapGroupSectionInfo = req.body.couse_id_list.map((ci) => [semesterId, ci]);

	const result = await semesterRepository.createGroupSections(mapGroupSectionInfo);

	sendResponse(res, result.rows);
};

export default {
	create,
	createGroupSections,
};
