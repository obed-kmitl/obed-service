import semesterRepository from '_/repositories/semester';
import { sendResponse } from '_/utils/response';

import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';
import { CreateSemesterRequestDTO } from '_/dtos/semester';
import { ApplicationError } from '_/errors/applicationError';
import { SemesterError } from '_/errors/semester';

/**
 * Create Semester
 */
const create = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const findResult = await semesterRepository.findByCurriculum(req.body.curriculum_id);
	const getAllYearNumber = [...findResult.rows].map((sem) => sem.year_number);
	const lastestYearNumber = Math.max(...getAllYearNumber);
	const newYearNumber = lastestYearNumber + 1;

	if (newYearNumber > new Date().getFullYear() + 545) {
		return next(new ApplicationError(SemesterError.INVALID_YEAR_NUMBER));
	}

	const createSemesterInfo: CreateSemesterRequestDTO = {
		year_number: newYearNumber,
		curriculum_id: req.body.curriculum_id,
	};

	const result = await semesterRepository.createSemester(createSemesterInfo);

	sendResponse(res, result.rows);
};

/**
 * Duplicate Semester
 */
const duplicate = async (req: Request, res: Response): Promise<Response> => {
	const { curriculum_id } = req.body;

	const result = await semesterRepository.duplicateSemester(curriculum_id);

	sendResponse(res, result.rows);
};

/**
 * Create multiple group sections
 */
const createGroupSections = async (req: Request, res: Response): Promise<Response> => {
	const { semesterId } = req.params;
	const mapGroupSectionInfo = req.body.course_id_list.map((ci) => [semesterId, ci]);

	const result = await semesterRepository.createGroupSections(mapGroupSectionInfo);

	sendResponse(res, result.rows);
};

/**
 * Create section
 */
const createSection = async (req: Request, res: Response): Promise<Response> => {
	const { groupSecId } = req.params;
	const { user_id_list, ...sectionInput } = req.body;

	const resultSection = await semesterRepository.createSection(groupSecId, sectionInput);
	const { section_id } = resultSection.rows[0];

	const mapTeacherInfo = user_id_list.map((uid) => ([
		section_id,
		uid,
	]));

	const result = await semesterRepository.saveTeachers(section_id, mapTeacherInfo);

	sendResponse(res, result.rows);
};

/**
 * Get section
 */
const get = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const { semesterId } = req.params;

	const result = await semesterRepository.find(semesterId);
	if (result.rows.length === 0) {
		return next(CommonError.RESOURCE_NOT_FOUND);
	}
	sendResponse(res, result.rows[0]);
};

/**
 * Get all sections by curriculum
 */
const getByCurriculum = async (req: Request,
	res: Response, next: NextFunction): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await semesterRepository.findByCurriculum(curriculumId);

	sendResponse(res, result.rows);
};

/**
 * Get all sections by teacher
 */
const getSectionByTeacher = async (req: Request,
	res: Response, next: NextFunction): Promise<Response> => {
	const { userId } = req;

	const result = await semesterRepository.findSectionByTeacher(userId);

	sendResponse(res, result.rows);
};

/**
 * Get all sections
 */
const getSection = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const { sectionId } = req.params;

	const result = await semesterRepository.findSection(sectionId);
	if (result.rows.length === 0) {
		return next(CommonError.RESOURCE_NOT_FOUND);
	}
	sendResponse(res, result.rows[0]);
};

/**
 * Update section
 */
const updateSection = async (req: Request, res: Response): Promise<Response> => {
	const { sectionId } = req.params;
	const { user_id_list, ...sectionInput } = req.body;
	const mapTeacherInfo = user_id_list.map((uid) => ([
		sectionId,
		uid,
	]));

	const [_, result] = await Promise.all([
		semesterRepository.updateSection(sectionId, sectionInput),
		semesterRepository.saveTeachers(sectionId, mapTeacherInfo),
	]);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Group Section
 */
const removeGroupSection = async (req: Request, res: Response): Promise<Response> => {
	const { groupSecId } = req.params;

	const result = await semesterRepository.deleteGroupSection(groupSecId);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Section
 */
const removeSection = async (req: Request, res: Response): Promise<Response> => {
	const { sectionId } = req.params;

	const result = await semesterRepository.deleteSection(sectionId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	createGroupSections,
	createSection,
	get,
	getSectionByTeacher,
	getByCurriculum,
	getSection,
	updateSection,
	removeGroupSection,
	removeSection,
	duplicate,
};
