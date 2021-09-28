import { authController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import { validate } from '_/middleware/validationHandler';
import { RegisterRequestDTO, LoginRequestDTO, UpdatePasswordRequestDTO } from '_/dtos/user';
import asyncWrapper from '_/middleware/asyncWrapper';

import { Router } from 'express';

const router = Router();

router.post('/register', [validate(RegisterRequestDTO)], asyncWrapper(authController.register));

router.post('/login', [validate(LoginRequestDTO)], asyncWrapper(authController.login));

router.post('/adminLogin', [validate(LoginRequestDTO)], asyncWrapper(authController.adminLogin));

router.post('/logout', [verifyToken], asyncWrapper(authController.logout));

router.get('/getAccessToken/:userId', asyncWrapper(authController.getAccessToken));

router.put('/updatePassword', [
	verifyToken,
	permit('ADMIN', 'TEACHER'),
	validate(UpdatePasswordRequestDTO),
], asyncWrapper(authController.updatePassword));

export default router;
