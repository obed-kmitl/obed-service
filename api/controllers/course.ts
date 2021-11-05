import courseRepository from '_/repositories/course';
import { sendResponse } from '_/utils/response';
import { CourseInputDTO, CreateCourseInputDTO } from '_/dtos/course';

import { Request, Response } from 'express';
import { deserialize } from 'json-typescript-mapper';

/**
 * Create Course
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const courseInput : CreateCourseInputDTO = {
		...req.body,
		relative_standards: req.body.relative_standards.map((rs_Id) => ([
			req.body.course_id,
			req.body.curriculum_id,
			rs_Id,
		])),
	};

	const result = await courseRepository.createCourse(courseInput);

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
	const { courseId, curriculumId } = req.params;
	const course = req.body;

	const courseInfo = deserialize(CourseInputDTO, {
		...course,
		relative_standards: course.relative_standards.map((rs_Id) => ([
			courseId,
			curriculumId,
			rs_Id,
		])),
	});

	const result = await courseRepository.updateCourse(courseInfo, courseId, curriculumId);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Course
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { courseId, curriculumId } = req.params;

	const result = await courseRepository.deleteCourse(courseId, curriculumId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	getAllByCurriculum,
	update,
	remove,
};
