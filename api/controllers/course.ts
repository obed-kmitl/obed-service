import courseRepository from '_/repositories/course';
import { sendResponse } from '_/utils/response';
import { CourseInputDTO } from '_/dtos/course';

import { Request, Response } from 'express';
import { deserialize } from 'json-typescript-mapper';

/**
 * Create Course
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await courseRepository.createCourse(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Get Course By CurriculumId
 */
const getAllByCurriculum = async (req: Request, res: Response): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await courseRepository.findAllByCurriculum(curriculumId);

	sendResponse(res, result.rows);
};

/**
 * Update Courses
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { courseId } = req.params;
	const course = req.body;

	const courseInfo = deserialize(CourseInputDTO, {
		course_id: courseId,
		...course,
	});

	const result = await courseRepository.updateCourse(courseInfo);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Course
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { courseId } = req.params;

	const result = await courseRepository.deleteCourse(courseId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	getAllByCurriculum,
	update,
	remove,
};
