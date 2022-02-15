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

router.get('/getAllBySection/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(cloController.getAllBySection));

router.get('/get/:cloId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(cloController.get));

router.put('/update/:cloId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(UpdateCLORequestDTO),
], asyncWrapper(cloController.update));

router.delete('/remove/:cloId', [verifyToken, permit('TEACHER')], asyncWrapper(cloController.remove));

export default router;
