import { sendResponse } from '_/utils/response';
import { assessmentRepository } from '_/repositories';

import { Request, Response } from 'express';
import { SaveIndividualAssessmentRequestDTO, SaveIndividualAssessmentPayload, SaveGroupAssessmentRequestDTO } from '_/dtos/assessment';
import _ from 'lodash';

/**
 * Save Individual
 */
const saveIndividual = async (req: Request, res: Response): Promise<Response> => {
	await SaveIndividualAssessmentRequestDTO.validate(req.body);
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
	const { sectionId, activityId } = req.params;
	const { rows } = await assessmentRepository.getAllIndividualByActivity(sectionId, activityId);
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

/**
 * createGroup
 */
const createGroup = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const result = await assessmentRepository.createGroup(req.body, activityId);
	sendResponse(res, result.rows[0]);
};

/**
 * updateGroup
 */
const updateGroup = async (req: Request, res: Response): Promise<Response> => {
	const { groupId } = req.params;
	const result = await assessmentRepository.updateGroup(req.body, groupId);
	sendResponse(res, result.rows[0]);
};

/**
 * assignGroup
 */
const assignGroup = async (req: Request, res: Response): Promise<Response> => {
	const { groupId } = req.params;
	const result = await assessmentRepository.assignGroup(req.body, groupId);
	sendResponse(res, result.rows[0]);
};

/**
 * getAllGroupByActivity
 */
const getAllGroupByActivity = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const result = await assessmentRepository.findAllGroupByActivity(activityId);
	sendResponse(res, result.rows);
};

/**
 * unassignGroup
 */
const unassignGroup = async (req: Request, res: Response): Promise<Response> => {
	const { groupId } = req.params;
	const result = await assessmentRepository.removeStudentGroup(req.body, groupId);
	sendResponse(res, result.rows[0]);
};

/**
 * Save Group Assessment
 */
const saveGroupAssessment = async (req: Request, res: Response): Promise<Response> => {
	const { groupAssessments }: SaveGroupAssessmentRequestDTO = req.body;
	const payloads: SaveIndividualAssessmentPayload[] = [];

	for (const groupAssessment of groupAssessments) {
		const result = await assessmentRepository.findGroup(groupAssessment.group_id);
		if (result.rows[0]) {
			const { students } = result.rows[0];
			for (const student of students) {
				for (const score of groupAssessment.scores) {
					payloads.push({
						student_id: student.student_id,
						sub_activity_id: score.sub_activity_id,
						score: score.obtained_score,
					});
				}
			}
		}
	}

	const saveIndividualPromiseList = await payloads.map(async (
		payload,
	) => assessmentRepository.saveIndividual(payload));
	Promise.all(saveIndividualPromiseList);

	sendResponse(res, { success: true });
};

/**
 * getAllGroupAssessmentByActivity
 */
const getAllGroupAssessmentByActivity = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const { rows } = await assessmentRepository.getAllGroupAssessmentByActivity(activityId);
	const groupByGroupId = _.groupBy(rows, 'group_id');

	const mapResult: any[] = [];
	for (const groupInfo of Object.values(groupByGroupId)) {
		const castGroupInfo = groupInfo as any;
		const groupByStudent = _.groupBy(groupInfo, 'student_number');

		const member: any[] = [];

		const scores: any[] = [];
		let hasScore = false;

		for (const studentInfo of Object.values(groupByStudent)) {
			const castStudentInfo = studentInfo as any[];
			member.push({
				student_id: castStudentInfo[0].student_id,
				student_number: castStudentInfo[0].student_number,
				prefix: castStudentInfo[0].prefix,
				firstname: castStudentInfo[0].firstname,
				lastname: castStudentInfo[0].lastname,
			});

			if (!hasScore) {
				scores.push(...castStudentInfo.map((obj) => ({
					sub_activity_id: obj.sub_activity_id,
					max_score: obj.max_score,
					obtained_score: obj.score,
				})));

				hasScore = true;
			}
		}

		mapResult.push({
			group_id: castGroupInfo[0].group_id,
			title: castGroupInfo[0].title,
			member,
			scores,
		});
	}

	sendResponse(res, mapResult);
};

/**
 * Remove Group
 */
const removeGroup = async (req: Request, res: Response): Promise<Response> => {
	const { groupId } = req.params;
	const result = await assessmentRepository.deleteGroup(groupId);

	sendResponse(res, result.rows[0]);
};

export default {
	saveIndividual,
	getAllIndividualByActivity,
	createGroup,
	assignGroup,
	getAllGroupByActivity,
	unassignGroup,
	saveGroupAssessment,
	getAllGroupAssessmentByActivity,
	removeGroup,
	updateGroup,
};
