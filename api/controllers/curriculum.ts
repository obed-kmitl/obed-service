import curriculumRepository from '_/repositories/curriculum';
import { sendResponse } from '_/utils/response';
import { CurriculumInputDTO } from '_/dtos/curriculum';

import { Request, Response } from 'express';
import { deserialize } from 'json-typescript-mapper';

/**
 * Create Curriculum
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await curriculumRepository.createCurriculum(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Get Curriculum By Id
 */
const get = async (req: Request, res: Response): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await curriculumRepository.findCurriculum(curriculumId);

	sendResponse(res, result.rows[0]);
};

/**
 * Get All Curriculums
 */
const getAll = async (req: Request, res: Response): Promise<Response> => {
	const result = await curriculumRepository.findAllCurriculum();

	sendResponse(res, result.rows);
};

/**
 * Update Curriculums
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { curriculumId } = req.params;
	const curriculum = req.body;

	const curriculumInfo = deserialize(CurriculumInputDTO, {
		curriculum_id: curriculumId,
		...curriculum,
	});

	const result = await curriculumRepository.updateCurriculum(curriculumInfo);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Curriculum
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await curriculumRepository.deleteCurriculum(curriculumId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	get,
	getAll,
	update,
	remove,
};
