import curriculumRepository from '_/repositories/curriculum';
import semesterRepository from '_/repositories/semester';
import { sendResponse } from '_/utils/response';
import { CurriculumInputDTO } from '_/dtos/curriculum';
import { CreateSemesterRequestDTO } from '_/dtos/semester';

import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';
import { deserialize } from 'json-typescript-mapper';

/**
 * Create Curriculum
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await curriculumRepository.createCurriculum(req.body);

	const createSemesterObject: CreateSemesterRequestDTO = {
		year_number: new Date().getFullYear() + 543,
		curriculum_id: result.rows[0].curriculum_id,
	};
	await semesterRepository.createSemester(createSemesterObject);

	sendResponse(res, result.rows[0]);
};

/**
 * Get Curriculum By Id
 */
const get = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await curriculumRepository.findCurriculum(curriculumId);

	sendResponse(res, result.rows[0]);
};

/**
 * Get All Curriculums
 */
const getAll = async (req: Request, res: Response, next:NextFunction): Promise<Response> => {
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

/**
 * Duplicate Curriculum
 */
const duplicate = async (req: Request, res: Response): Promise<Response> => {
	const { curriculumId } = req.params;
	const result = await curriculumRepository.duplicate(curriculumId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	get,
	getAll,
	update,
	remove,
	duplicate,
};
