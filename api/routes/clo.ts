import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { cloController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import { CreateCLORequestDTO, UpdateCLORequestDTO } from '_/dtos/clo';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateCLORequestDTO),
], asyncWrapper(cloController.create));

// router.put('/update/:cloId', [
// 	verifyToken,
// 	permit('TEACHER'),
// 	validateRequest(UpdateCLORequestDTO),
// ], asyncWrapper(cloController.update));

export default router;
