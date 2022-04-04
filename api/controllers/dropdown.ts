import { sendResponse } from '_/utils/response';

import { Request, Response, NextFunction } from 'express';
import { dropdownService } from '_/services';

export const getSemester = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { curriculumId } = req.params;
	const result = await dropdownService.getSemester(curriculumId);
	sendResponse(res, result);
};

export const getCourse = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { semesterId } = req.params;
	const result = await dropdownService.getCourse(semesterId);
	sendResponse(res, result);
};

export const getStudentNumber = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const { curriculumId } = req.params;
	const result = await dropdownService.getStudentNumber(curriculumId);
	sendResponse(res, result);
};
