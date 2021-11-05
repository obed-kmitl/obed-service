import { semesterController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { CreateSemesterRequestDTO } from '_/dtos/semester';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateSemesterRequestDTO),
], asyncWrapper(semesterController.create));

export default router;
