import { sendResponse } from '_/utils/response';
import { studentRepository } from '_/repositories';

import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';

/**
 * Create students
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const { students } = req.body;
	const studentArray = students.map((stu) => ([
		stu.section_id,
		stu.prefix,
		stu.student_number,
		stu.firstname,
		stu.lastname,
	]));
	await studentRepository.create(studentArray);

	sendResponse(res, { message: 'Create all students success' });
};

/**
 * Update student
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { studentId } = req.params;
	const result = await studentRepository.update(studentId, req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Get all students by section
 */
const getAllBySection = async (req: Request, res: Response,
	next:NextFunction): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await studentRepository.getAllBySection(sectionId);
	if (result.rows.length === 0) {
		return next(CommonError.RESOURCE_NOT_FOUND);
	}
	const sortResult = result.rows.sort((
		a, b,
	) => parseFloat(a.student_number) - parseFloat(b.student_number));

	sendResponse(res, sortResult);
};

/**
 * Get student
 */
const get = async (req: Request, res: Response, next:NextFunction): Promise<Response> => {
	const { studentId } = req.params;
	const result = await studentRepository.get(studentId);
	if (result.rows.length === 0) {
		return next(CommonError.RESOURCE_NOT_FOUND);
	}
	sendResponse(res, result.rows[0]);
};

/**
 * Remove student
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { studentId } = req.params;
	const result = await studentRepository.remove(studentId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	getAllBySection,
	get,
	remove,
	update,
};
