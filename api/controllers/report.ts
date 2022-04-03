import reportRepository from '_/repositories/report';
import { sendResponse } from '_/utils/response';
import { summaryService } from '_/services';

import { Request, Response, NextFunction } from 'express';

/**
 * Create Report
 */
const save = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const result = await reportRepository.save(req.body);
	sendResponse(res, result.rows[0]);
};

/**
 * Get Report
 */
const getReportBySection = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await reportRepository.getReportBySection(sectionId);

	sendResponse(res, result.rows[0]);
};

/**
 * getSectionReport
 */
const getSectionReport = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await summaryService.getCLOSummaryBySection(sectionId);
	sendResponse(res, result);
};

export default {
	save,
	getReportBySection,
	getSectionReport,
};
