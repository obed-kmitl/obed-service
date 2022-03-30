import { courseController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { CreateAllCourseRequestDTO, CreateCourseRequestDTO, UpdateCourseRequestDTO } from '_/dtos/course';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/createAll', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateAllCourseRequestDTO),
], asyncWrapper(courseController.createAll));

router.post('/create', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateCourseRequestDTO),
], asyncWrapper(courseController.create));

router.get('/getAllByCurriculum/:curriculumId', [verifyToken, permit('ADMIN')], asyncWrapper(courseController.getAllByCurriculum));

router.put('/update/:courseId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(UpdateCourseRequestDTO),
], asyncWrapper(courseController.update));

router.delete('/remove/:courseId', [verifyToken, permit('ADMIN')], asyncWrapper(courseController.remove));

export default router;
