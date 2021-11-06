import { mapStandardController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { CreateMapStandardRequestDTO } from '_/dtos/mapStandard';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/save', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateMapStandardRequestDTO),
], asyncWrapper(mapStandardController.save));

router.get('/get/:curriculumId', [
	verifyToken,
	permit('ADMIN'),
], asyncWrapper(mapStandardController.get));

router.get('/getRelativeStandard/:curriculumId', [
	verifyToken,
	permit('ADMIN'),
], asyncWrapper(mapStandardController.getAllRelativeStandard));

export default router;
