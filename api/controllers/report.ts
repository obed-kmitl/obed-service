import reportRepository from '_/repositories/report';
import { sendResponse } from '_/utils/response';

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

export default {
	save,
	getReportBySection,
};
