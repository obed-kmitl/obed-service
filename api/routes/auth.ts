import { authController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import { validateRequest } from '_/middleware/validationHandler';
import { RegisterRequestDTO, LoginRequestDTO, UpdatePasswordRequestDTO } from '_/dtos/user';
import asyncWrapper from '_/middleware/asyncWrapper';

import { Router } from 'express';

const router = Router();

router.post('/register', [validateRequest(RegisterRequestDTO)], asyncWrapper(authController.register));

router.post('/adminRegister', [validateRequest(RegisterRequestDTO)], asyncWrapper(authController.adminRegister));

router.post('/login', [validateRequest(LoginRequestDTO)], asyncWrapper(authController.login));

router.post('/adminLogin', [validateRequest(LoginRequestDTO)], asyncWrapper(authController.adminLogin));

router.post('/logout/:userId', asyncWrapper(authController.logout));

router.post('/getAccessToken', asyncWrapper(authController.getAccessToken));

router.put('/updatePassword', [
	verifyToken,
	permit('ADMIN', 'TEACHER'),
	validateRequest(UpdatePasswordRequestDTO),
], asyncWrapper(authController.updatePassword));

router.post('/googleAuthToken', [verifyToken], asyncWrapper(authController.googleAuthToken));

export default router;
