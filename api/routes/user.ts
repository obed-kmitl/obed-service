import { userController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import { validate } from '_/middleware/validationHandler';
import { UpdateUserProfileRequestDTO } from '_/dtos/user';
import asyncWrapper from '_/middleware/asyncWrapper';

import express from 'express';

const router = express.Router();

router.get('/getProfile', [verifyToken, permit('TEACHER', 'TEACHER')], asyncWrapper(userController.getProfile));

router.get('/getAllUsers', [verifyToken, permit('ADMIN')], asyncWrapper(userController.getAllUsers));

router.put('/updateProfile', [
	verifyToken,
	permit('ADMIN', 'TEACHER'),
	validate(UpdateUserProfileRequestDTO),
], asyncWrapper(userController.updateProfile));

export default router;
