import { sendResponse } from '_/utils/response';
import { assessmentRepository } from '_/repositories';

import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';
import { SaveIndividualAssessmentRequestDTO, SaveIndividualAssessmentPayload } from '_/dtos/assessment';
import activity from '_/repositories/activity';
import _ from 'lodash';

/**
 * Save Individual
 */
const saveIndividual = async (req: Request, res: Response): Promise<Response> => {
	const { individualAssessments }: SaveIndividualAssessmentRequestDTO = req.body;
	const payloads: SaveIndividualAssessmentPayload[] = [];

	for (const individualAssessment of individualAssessments) {
		for (const score of individualAssessment.scores) {
			payloads.push({
				student_id: individualAssessment.student_id,
				sub_activity_id: score.sub_activity_id,
				score: score.obtained_score,
			});
		}
	}

	const saveIndividualPromiseList = await payloads.map(async (
		payload,
	) => assessmentRepository.saveIndividual(payload));
	Promise.all(saveIndividualPromiseList);

	sendResponse(res, { success: true });
};

/**
 * getAllIndividualByActivity
 */
const getAllIndividualByActivity = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const { rows } = await assessmentRepository.getAllIndividualByActivity(activityId);
	const groupByStudent = _.groupBy(rows, 'student_number');

	const mapResult: any[] = [];
	for (const studentInfo of Object.values(groupByStudent)) {
		const castStudentInfo = studentInfo as any[];
		mapResult.push(
			{
				student_id: castStudentInfo[0].student_id,
				student_number: castStudentInfo[0].student_number,
				prefix: castStudentInfo[0].prefix,
				firstname: castStudentInfo[0].firstname,
				lastname: castStudentInfo[0].lastname,
				scores: castStudentInfo.map((obj) => ({
					sub_activity_id: obj.sub_activity_id,
					max_score: obj.max_score,
					obtained_score: obj.score,
				})),
			},
		);
	}

	sendResponse(res, mapResult);
};

export default {
	saveIndividual,
	getAllIndividualByActivity,
};
