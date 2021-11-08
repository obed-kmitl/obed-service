import courseRepository from '_/repositories/course';
import { sendResponse } from '_/utils/response';
import mapStandardRepository from '_/repositories/mapStandard';

import { Request, Response } from 'express';

/**
 * Create Course
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const { relative_standards, ...courseInput } = req.body;

	const resultCourse = await courseRepository.createCourse(courseInput);
	const { course_id, curriculum_id } = resultCourse.rows[0];

	let mapStandards = [];
	if (relative_standards.length > 0) {
		const resultMapstandard = await mapStandardRepository.findMapStandardBySubStdId(
			relative_standards, curriculum_id,
		);
		mapStandards = resultMapstandard.rows.map((row) => row.map_sub_std_id);
	}

	const relativeStandardInfo = mapStandards.map((rs_Id) => ([
		course_id,
		rs_Id,
	]));

	const result = await courseRepository.createCourseSubStandards(course_id, relativeStandardInfo);

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

	const { relative_standards, ...courseInput } = req.body;

	const resultCourse = await courseRepository.updateCourse(courseInput, courseId);
	const { course_id, curriculum_id } = resultCourse.rows[0];

	let mapStandards = [];
	if (relative_standards.length > 0) {
		const resultMapstandard = await mapStandardRepository.findMapStandardBySubStdId(
			relative_standards, curriculum_id,
		);
		mapStandards = resultMapstandard.rows.map((row) => row.map_sub_std_id);
	}

	const relativeStandardInfo = mapStandards.map((rs_Id) => ([
		course_id,
		rs_Id,
	]));

	const result = await courseRepository.createCourseSubStandards(course_id, relativeStandardInfo);

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
