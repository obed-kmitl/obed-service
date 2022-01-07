import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { activityController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import { CreateActivityRequestDTO, CreateCategoryRequestDTO } from '_/dtos/activity';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateActivityRequestDTO),
], asyncWrapper(activityController.create));

router.post('/createCategory', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateCategoryRequestDTO),
], asyncWrapper(activityController.createCategory));

export default router;
