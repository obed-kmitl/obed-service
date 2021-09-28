import { userController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import { validateRequest } from '_/middleware/validationHandler';
import { UpdateUserProfileRequestDTO } from '_/dtos/user';
import asyncWrapper from '_/middleware/asyncWrapper';

import express from 'express';

const router = express.Router();

router.get('/getProfile', [verifyToken, permit('ADMIN', 'TEACHER')], asyncWrapper(userController.getProfile));

router.get('/getAll', [verifyToken, permit('ADMIN')], asyncWrapper(userController.getAll));

router.put('/update/:userId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(UpdateUserProfileRequestDTO),
], asyncWrapper(userController.update));

router.put('/updateProfile', [
	verifyToken,
	permit('ADMIN', 'TEACHER'),
	validateRequest(UpdateUserProfileRequestDTO),
], asyncWrapper(userController.updateProfile));

router.delete('/remove/:userId', [verifyToken, permit('ADMIN')], asyncWrapper(userController.remove));

export default router;
