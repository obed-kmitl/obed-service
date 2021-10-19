import { curriculumController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { CreateCurriculumRequestDTO } from '_/dtos/curriculum';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateCurriculumRequestDTO),
], asyncWrapper(curriculumController.create));

export default router;
