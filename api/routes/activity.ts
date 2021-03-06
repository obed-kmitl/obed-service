import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { activityController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import {
	CreateActivityRequestDTO, UpdateActivityRequestDTO,
	CreateSubActivityRequestDTO, UpdateSubActivityRequestDTO,
	CreateActivityFromClassroomRequestDTO,
} from '_/dtos/activity';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateActivityRequestDTO),
], asyncWrapper(activityController.create));

router.post('/createFromClassroom', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateActivityFromClassroomRequestDTO),
], asyncWrapper(activityController.createFromClassroom));

router.put('/update/:activityId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(UpdateActivityRequestDTO),
], asyncWrapper(activityController.update));

router.get('/getAllBySection/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(activityController.getAllBySection));

router.delete('/remove/:activityId', [verifyToken, permit('TEACHER')], asyncWrapper(activityController.remove));

router.post('/createSubActivity', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateSubActivityRequestDTO),
], asyncWrapper(activityController.createSubActivity));

router.get('/get/:activityId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(activityController.get));

router.put('/updateSubActivity/:subActivityId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(UpdateSubActivityRequestDTO),
], asyncWrapper(activityController.updateSubActivity));

router.delete('/removeSubActivity/:subActivityId', [verifyToken, permit('TEACHER')], asyncWrapper(activityController.removeSubActivity));

export default router;
