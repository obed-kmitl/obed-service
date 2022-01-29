import { sendResponse } from '_/utils/response';
import { cloRepository, mapStandardRepository } from '_/repositories';

import { Request, Response } from 'express';

/**
 * Create Course Learning Outcome
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await cloRepository.create(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Update Course Learning Outcome
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { cloId } = req.params;

	const { relative_standards, ...cloInput } = req.body;

	await cloRepository.update(cloInput, cloId);

	const curriculumId = await cloRepository.getCurriculumByCLO(cloId);

	let mapStandards = [];
	if (relative_standards.length > 0) {
		const resultMapstandard = await mapStandardRepository.findMapStandardBySubStdId(
			relative_standards, curriculumId,
		);
		mapStandards = resultMapstandard.rows.map((row) => row.map_sub_std_id);
	}

	const relativeStandardInfo = mapStandards.map((rs_Id) => ([
		cloId,
		rs_Id,
	]));

	const result = await cloRepository.createCLOSubStandards(cloId, relativeStandardInfo);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	update,
};
