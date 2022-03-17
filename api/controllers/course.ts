import courseRepository from '_/repositories/course';
import { sendResponse } from '_/utils/response';
import mapStandardRepository from '_/repositories/mapStandard';

import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';
import { CreateAllCourseRequestDTO } from '_/dtos/course';
import _ from 'lodash';

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
 * Create all courses
 */
const createAll = async (req: Request, res: Response): Promise<Response> => {
	const { courses } = req.body as CreateAllCourseRequestDTO;

	const createAllCourses = courses.map(async (ele) => courseRepository.createCourse(ele));
	const results = await Promise.all(createAllCourses);

	sendResponse(res,
		_.chain(results).map(
			(ele) => ele.rows[0],
		).value());
};

/**
 * Get Course By CurriculumId
 */
const getAllByCurriculum = async (req: Request,
	res: Response, next:NextFunction): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await courseRepository.findAllByCurriculum(curriculumId);

	const sortedResults = result.rows.map((course) => {
		const sortRelativeStandards = course.relative_standards.sort((
			ra, rb,
		) => {
			const concatA = `${ra.group_sub_order_number}.${ra.sub_order_number}`;
			const concatB = `${rb.group_sub_order_number}.${rb.sub_order_number}`;

			return parseFloat(concatA) - parseFloat(concatB);
		});

		return { ...course, relative_standards: sortRelativeStandards };
	});

	sendResponse(res, sortedResults);
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
	createAll,
};
