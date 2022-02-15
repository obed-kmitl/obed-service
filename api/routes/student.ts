import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { studentController } from '_/controllers';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';
import {
	CreateStudentRequestDTO, UpdateStudentRequestDTO,
} from '_/dtos/student';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateStudentRequestDTO),
], asyncWrapper(studentController.create));

router.put('/update/:studentId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(UpdateStudentRequestDTO),
], asyncWrapper(studentController.update));

router.get('/getAllBySection/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(studentController.getAllBySection));

router.get('/get/:studentId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(studentController.get));

router.delete('/remove/:studentId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(studentController.remove));

export default router;
