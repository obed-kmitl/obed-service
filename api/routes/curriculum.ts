import { curriculumController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { CreateCurriculumRequestDTO, UpdateCurriculumRequestDTO } from '_/dtos/curriculum';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/duplicate/:curriculumId', [
	verifyToken,
	permit('ADMIN'),
], asyncWrapper(curriculumController.duplicate));

router.post('/create', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateCurriculumRequestDTO),
], asyncWrapper(curriculumController.create));

router.get('/get/:curriculumId', [verifyToken, permit('ADMIN')], asyncWrapper(curriculumController.get));

router.get('/getAll', [verifyToken, permit('ADMIN')], asyncWrapper(curriculumController.getAll));

router.put('/update/:curriculumId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(UpdateCurriculumRequestDTO),
], asyncWrapper(curriculumController.update));

router.delete('/remove/:curriculumId', [verifyToken, permit('ADMIN')], asyncWrapper(curriculumController.remove));

export default router;
