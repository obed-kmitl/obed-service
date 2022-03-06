import { standardController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import {
	CreateStandardRequestDTO,
	CreateGroupSubStandardRequestDTO,
	CreateSubStandardRequestDTO,
	UpdateStandardRequestDTO,
	UpdateGroupSubStandardRequestDTO,
	UpdateSubStandardRequestDTO,
	CreateAllStandardsRequestDTO,
} from '_/dtos/standard';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/createAllStandards', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateAllStandardsRequestDTO),
], asyncWrapper(standardController.createAllStandards));

router.post('/create', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateStandardRequestDTO),
], asyncWrapper(standardController.create));

router.post('/createGroupSubStandard', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateGroupSubStandardRequestDTO),
], asyncWrapper(standardController.createGroupSubStandard));

router.post('/createSubStandard', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateSubStandardRequestDTO),
], asyncWrapper(standardController.createSubStandard));

router.get('/getAllByCurriculum/:curriculumId',
	[verifyToken, permit('ADMIN')],
	asyncWrapper(standardController.getAllByCurriculum));

router.get('/get/:standardId',
	[verifyToken, permit('ADMIN')],
	asyncWrapper(standardController.get));

router.put('/update/:standardId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(UpdateStandardRequestDTO),
], asyncWrapper(standardController.update));

router.put('/updateGroupSubStandard/:groupSubStdId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(UpdateGroupSubStandardRequestDTO),
], asyncWrapper(standardController.updateGroupSubStandard));

router.put('/updateSubStandard/:subStdId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(UpdateSubStandardRequestDTO),
], asyncWrapper(standardController.updateSubStandard));

router.delete('/remove/:standardId', [verifyToken, permit('ADMIN')], asyncWrapper(standardController.remove));
router.delete('/removeGroupSubStandard/:groupSubStdId', [verifyToken, permit('ADMIN')], asyncWrapper(standardController.removeGroupSubStandard));
router.delete('/removeSubStandard/:subStdId', [verifyToken, permit('ADMIN')], asyncWrapper(standardController.removeSubStandard));

export default router;
