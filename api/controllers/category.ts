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
	const { categoryId } = req.params;
	const updateCategoryRequestDTO: UpdateCategoryRequestDTO = {
		...req.body,
		category_id: categoryId,
	};
	const result = await categoryRepository.update(updateCategoryRequestDTO);

	sendResponse(res, result.rows[0]);
};

/**
 * Get All Category
 */
const getAllBySection = async (req: Request, res: Response): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await categoryRepository.getAllBySection(sectionId);

	sendResponse(res, result.rows);
};

/**
 * Remove Category
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { categoryId } = req.params;
	const result = await categoryRepository.remove(categoryId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	update,
	remove,
	getAllBySection,
};
