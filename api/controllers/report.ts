import { sendResponse } from '_/utils/response';
import { Request, Response } from 'express';
import ejs from 'ejs';
import pdf from 'html-pdf';
import { CommonError } from '_/errors/common';
import path from 'path';

/**
 * Generate report by section
 */
const generate = async (req: Request, res: Response): Promise<Response> => {
	const students = [
		{
			name: 'Joy',
			email: 'joy@example.com',
			city: 'New York',
			country: 'USA',
		},
		{
			name: 'John',
			email: 'John@example.com',
			city: 'San Francisco',
			country: 'USA',
		},
		{
			name: 'Clark',
			email: 'Clark@example.com',
			city: 'Seattle',
			country: 'USA',
		},
		{
			name: 'Watson',
			email: 'Watson@example.com',
			city: 'Boston',
			country: 'USA',
		},
		{
			name: 'Tony',
			email: 'Tony@example.com',
			city: 'Los Angels',
			country: 'USA',
		}];

	ejs.renderFile(path.join(__dirname, '../templates/', 'report.ejs'), { students }, (err, data) => {
		if (err) {
			res.send(err);
		} else {
			let options = {
				height: '11.25in',
				width: '8.5in',
				header: {
					height: '20mm',
				},
				footer: {
					height: '20mm',
				},
			};
			pdf.create(data, options).toFile('reports/report.pdf', (reportErr, reportData) => {
				if (err) {
					throw CommonError.UNKNOWN_ERROR;
				} else {
					res.send('File created successfully');
					sendResponse(res, { success: true });
				}
			});
		}
	});
};

export default {
	generate,
};
