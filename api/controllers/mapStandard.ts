import { sendResponse } from '_/utils/response';
import mapStandardRepository from '_/repositories/mapStandard';
import { CreateMapStandardRequestDTO, MapStandardInputDTO } from '_/dtos/mapStandard';

import { Request, Response } from 'express';

/**
 * Save Map Standard
 */
const save = async (req: Request, res: Response): Promise<Response> => {
	const {
		curriculum_id,
		main_std_id,
		relative_std_id,
		map_sub_standards,
	} = req.body as CreateMapStandardRequestDTO;

	const mapStandardInput : MapStandardInputDTO = {
		curriculum_id,
		main_std_id,
		relative_std_id,
	};

	const mapSubStandardValues = map_sub_standards.map((mss) => ([
		curriculum_id,
		mss.main_sub_std_id,
		mss.relative_sub_std_id,
	]));

	const [resultMapStandard, resultMapSubStandard] = await Promise.all([
		mapStandardRepository.create(mapStandardInput),
		mapStandardRepository.createMapSubStandard(mapSubStandardValues, curriculum_id),
	]);

	sendResponse(res,
		{
			...resultMapStandard.rows[0],
			map_sub_standards: resultMapSubStandard.rows,
		});
};

/**
 * Get map standard by curriculumId
 */
const get = async (req: Request, res: Response): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await mapStandardRepository.findMapStandard(curriculumId);

	sendResponse(res, result.rows[0]);
};

/**
 * Get all relative standard
 */
const getAllRelativeStandard = async (req: Request, res: Response): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await mapStandardRepository.findAllRelativeStandard(curriculumId);

	sendResponse(res, result.rows);
};

export default {
	save,
	get,
	getAllRelativeStandard,
};
