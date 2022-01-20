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

	const [resultMapStandard, resultMapSubStandard] = await Promise.all([
		mapStandardRepository.create(mapStandardInput),
		mapStandardRepository.createMapSubStandard(map_sub_standards, curriculum_id),
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

	const sortedResults = result.rows.sort((
		ra, rb,
	) => {
		const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
		const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

		return parseFloat(concatA) - parseFloat(concatB);
	});

	sendResponse(res, sortedResults);
};

export default {
	save,
	get,
	getAllRelativeStandard,
};
