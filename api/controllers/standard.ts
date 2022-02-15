import { sendResponse } from '_/utils/response';
import standardRepository from '_/repositories/standard';
import { StandardInputDTO, GroupSubStandardInputDTO, SubStandardInputDTO } from '_/dtos/standard';
import { Request, Response, NextFunction } from 'express';
import { CommonError } from '_/errors/common';

import { deserialize } from 'json-typescript-mapper';

/**
 * Create Standard
 */
const create = async (req: Request, res: Response): Promise<Response> => {
	const result = await standardRepository.create(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Create Group Sub Standard
 */
const createGroupSubStandard = async (req: Request, res: Response): Promise<Response> => {
	const result = await standardRepository.creatGroupSubStandard(req.body);
	sendResponse(res, result.rows[0]);
};

/**
 * Create Sub Standard
 */
const createSubStandard = async (req: Request, res: Response): Promise<Response> => {
	const result = await standardRepository.creatSubStandard(req.body);

	sendResponse(res, result.rows[0]);
};

/**
 * Get By StandardId
 */
const get = async (req: Request, res: Response, next:NextFunction): Promise<Response> => {
	const { standardId } = req.params;

	const result = await standardRepository.findStandard(standardId);

	sendResponse(res, result.rows);
};

/**
 * Get Standard By CurriculumId
 */
const getAllByCurriculum = async (req: Request,
	res: Response, next:NextFunction): Promise<Response> => {
	const { curriculumId } = req.params;

	const result = await standardRepository.findAllByCurriculum(curriculumId);

	sendResponse(res, result.rows);
};

/**
 * Update Standards
 */
const update = async (req: Request, res: Response): Promise<Response> => {
	const { standardId } = req.params;
	const standard = req.body;

	const standardInfo = deserialize(StandardInputDTO, {
		standard_id: standardId,
		...standard,
	});

	const result = await standardRepository.updateStandard(standardInfo);

	sendResponse(res, result.rows[0]);
};

/**
 * Update Group Sub Standards
 */
const updateGroupSubStandard = async (req: Request, res: Response): Promise<Response> => {
	const { groupSubStdId } = req.params;
	const groupSubStandard = req.body;

	const groupSubStandardInfo = deserialize(GroupSubStandardInputDTO, {
		group_sub_std_id: groupSubStdId,
		...groupSubStandard,
	});

	const result = await standardRepository.updateGroupSubStandard(groupSubStandardInfo);

	sendResponse(res, result.rows[0]);
};

/**
 * Update Sub Standards
 */
const updateSubStandard = async (req: Request, res: Response): Promise<Response> => {
	const { subStdId } = req.params;
	const subStandard = req.body;

	const SubStandardInfo = deserialize(SubStandardInputDTO, {
		sub_std_id: subStdId,
		...subStandard,
	});

	const result = await standardRepository.updateSubStandard(SubStandardInfo);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Standard
 */
const remove = async (req: Request, res: Response): Promise<Response> => {
	const { standardId } = req.params;

	const result = await standardRepository.deleteStandard(standardId);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Group Sub Standard
 */
const removeGroupSubStandard = async (req: Request, res: Response): Promise<Response> => {
	const { groupSubStdId } = req.params;

	const result = await standardRepository.deleteGroupSubStandard(groupSubStdId);

	sendResponse(res, result.rows[0]);
};

/**
 * Remove Sub Standard
 */
const removeSubStandard = async (req: Request, res: Response): Promise<Response> => {
	const { subStdId } = req.params;

	const result = await standardRepository.deleteSubStandard(subStdId);

	sendResponse(res, result.rows[0]);
};

export default {
	create,
	createGroupSubStandard,
	createSubStandard,
	get,
	getAllByCurriculum,
	update,
	updateGroupSubStandard,
	updateSubStandard,
	remove,
	removeGroupSubStandard,
	removeSubStandard,
};
