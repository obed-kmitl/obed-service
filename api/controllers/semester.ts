import semesterRepository from '_/repositories/semester';
import { sendResponse } from '_/utils/response';

import { Request, Response } from 'express';

/**
 * Create Semester
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await semesterRepository.createSemester(req.body);

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
const get = async (req: Request, res: Response): Promise<Response> => {
	const { semesterId } = req.params;

	const result = await semesterRepository.find(semesterId);

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
	updateSection,
	removeGroupSection,
	removeSection,
};
