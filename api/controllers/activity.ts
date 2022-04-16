import { sendResponse } from '_/utils/response';
import { activityRepository } from '_/repositories';
import { UpdateActivityRequestDTO, CreateActivityRequestDTO } from '_/dtos/activity';

import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';
import { activityService } from '_/services';

/**
 * Create Activity
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await activityRepository.create(req.body);

	sendResponse(res, result.rows[0]);
};

const createFromClassroom = async (
	req: Request, res: Response, next: NextFunction,
): Promise<Response> => {
	const result = await activityService.createFromClassroom(req, next);
	sendResponse(res, result);
};

/**
 * Get All activity by section
 */
const getAllBySection = async (req: Request,
	res: Response, next:NextFunction): Promise<Response> => {
	const { sectionId } = req.params;
	const result = await activityRepository.getAllBySection(sectionId);

	sendResponse(res, result);
};

/**
 * Update Activity
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const updateActivityRequestDTO: UpdateActivityRequestDTO = {
		...req.body,
	};
	const result = await activityRepository.update(updateActivityRequestDTO, activityId);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Activity
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { activityId } = req.params;
	const result = await activityRepository.remove(activityId);

	sendResponse(res, result.rows[0]);
};

/**
 * Create Sub Activity
 */
const createSubActivity = async (req: Request, res: Response): Promise<Response> => {
	const { clos } = req.body;
	const result = await activityRepository.createSubActivity(req.body);

	const subActivityId: number = result.rows[0].sub_activity_id;
	const cloArray: number[][] = clos.map((clo) => [subActivityId, clo]);
	const createCLOResult = await activityRepository.createSubActivitiesCLO(subActivityId, cloArray);

	const sortedClos = createCLOResult.rows[0].clos.sort((
		a, b,
	) => parseFloat(a.order_number) - parseFloat(b.order_number));

	sendResponse(res, {
		...createCLOResult.rows[0],
		clos: sortedClos,
	});
};

/**
 * Update Sub Activity
 */
const updateSubActivity = async (req: Request, res: Response): Promise<Response> => {
	const { subActivityId } = req.params;
	const { clos } = req.body;
	await activityRepository.updateSubActivity(subActivityId, req.body);

	const cloArray: number[][] = clos.map((clo) => [subActivityId, clo]);
	const createCLOResult = await activityRepository.createSubActivitiesCLO(subActivityId, cloArray);

	const sortedClos = createCLOResult.rows[0].clos.sort((
		a, b,
	) => parseFloat(a.order_number) - parseFloat(b.order_number));

	sendResponse(res, {
		...createCLOResult.rows[0],
		clos: sortedClos,
	});
};

/**
 * Get activity
 */
const get = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
	const { activityId } = req.params;
	const activityResult = await activityRepository.find(activityId);

	if (activityResult.rows.length === 0) {
		return next(CommonError.RESOURCE_NOT_FOUND);
	}

	const result = await activityRepository.findAllSubActivity(activityId);

	const sortedResult = result.rows.map((row) => {
		const sortedClos = row.clos.sort((
			a, b,
		) => parseFloat(a.order_number) - parseFloat(b.order_number));

		return {
			...row,
			clos: sortedClos,
		};
	});

	sendResponse(res, {
		...activityResult.rows[0],
		subActivities: sortedResult,
	});
};

/**
 * Remove sub activity
 */
const removeSubActivity = async (req: Request, res: Response): Promise<Response> => {
	const { subActivityId } = req.params;
	const result = await activityRepository.removeSubActivity(subActivityId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	getAllBySection,
	update,
	remove,
	createSubActivity,
	updateSubActivity,
	get,
	removeSubActivity,
	createFromClassroom,
};
