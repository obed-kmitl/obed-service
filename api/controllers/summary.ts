import { Request, Response, NextFunction } from 'express';

import { sendResponse } from '_/utils/response';
import { summaryService } from '_/services';

/**
 * getCLOSummaryBySection
 */
const getCLOSummaryBySection = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await summaryService.getCLOSummaryBySection(sectionId);
	sendResponse(res, result);
};

/**
 * getPLOSummaryBySection
 */
const getPLOSummaryBySection = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await summaryService.getPLOSummaryBySection(sectionId);
	sendResponse(res, result);
};

/**
 * getPLOSummaryByStudentAndSection
 */
const getPLOSummaryByStudentAndSection = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { sectionId, studentId } = req.params;
	const result = await summaryService.getPLOSummaryByStudentAndSection(sectionId, studentId);
	sendResponse(res, result);
};

/**
 * getPLOSummaryByCourseAndSemester
 */
const getPLOSummaryByCourseAndSemester = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { courseId, semesterId } = req.params;
	const result = await summaryService.getPLOSummaryByCourseAndSemester(
		courseId, semesterId,
	);
	sendResponse(res, result);
};

/**
 * getPLOSummaryByCurriculum
 */
const getPLOSummaryByCurriculum = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { curriculumId } = req.params;
	const result = await summaryService.getPLOSummaryByCurriculum(
		curriculumId,
	);
	sendResponse(res, result);
};

/**
 *  getPLOSummaryByStudentNumberAndCurriculum
 */
const getPLOSummaryByStudentNumberAndCurriculum = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { curriculumId, studentNumber } = req.params;
	const result = await summaryService.getPLOSummaryByStudentNumberAndCurriculum(
		curriculumId, studentNumber,
	);
	sendResponse(res, result);
};

export default {
	getCLOSummaryBySection,
	getPLOSummaryBySection,
	getPLOSummaryByStudentAndSection,
	getPLOSummaryByCourseAndSemester,
	getPLOSummaryByCurriculum,
	getPLOSummaryByStudentNumberAndCurriculum,
};
