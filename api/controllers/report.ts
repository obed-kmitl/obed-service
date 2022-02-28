// import reportRepository from '_/repositories/report';
import { sendResponse } from '_/utils/response';

import { Request, Response, NextFunction } from 'express';

/**
 * Create Report
 */
const save = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	console.log(req.body);
	sendResponse(res, 'report saving successfully');
};

export default {
	save,
};
