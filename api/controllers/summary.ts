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

export default {
	getCLOSummaryBySection,
	getPLOSummaryBySection,
	getPLOSummaryByStudentAndSection,
};
