import { sendResponse } from '_/utils/response';
import { categoryRepository } from '_/repositories';

import { Request, Response } from 'express';
import { UpdateCategoryRequestDTO } from '_/dtos/category';

/**
 * Create Category
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await categoryRepository.create(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Update Category
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { sectionId } = req.params;
	const updateCategoryRequestDTO: UpdateCategoryRequestDTO = {
		...req.body,
		section_id: sectionId,
	};
	const result = await categoryRepository.update(updateCategoryRequestDTO);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	update,
};
