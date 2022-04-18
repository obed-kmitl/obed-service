import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { googleController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import { GoogleAuthorizationRequestDTO } from '_/dtos/google';

const router = express.Router();

router.post('/authorize', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(GoogleAuthorizationRequestDTO),
], asyncWrapper(googleController.authorize));

router.post('/logout/:userId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(googleController.logout));

router.get('/listCourses', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(googleController.listCourses));

router.get('/listCourseWorks/:courseId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(googleController.listCourseWorks));

export default router;
