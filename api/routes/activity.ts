import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { activityController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import { CreateActivityRequestDTO, UpdateActivityRequestDTO } from '_/dtos/activity';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateActivityRequestDTO),
], asyncWrapper(activityController.create));

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

export default router;
