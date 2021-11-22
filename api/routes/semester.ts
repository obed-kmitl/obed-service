import { semesterController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import {
	CreateSemesterRequestDTO, CreateGroupSectionsRequestDTO,
	CreateSectionRequestDTO, UpdateSectionRequestDTO,
	DuplicateSemesterRequestDTO,
} from '_/dtos/semester';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/create', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateSemesterRequestDTO),
], asyncWrapper(semesterController.create));

router.post('/duplicate', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(DuplicateSemesterRequestDTO),
], asyncWrapper(semesterController.duplicate));

router.post('/createGroupSections/:semesterId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateGroupSectionsRequestDTO),
], asyncWrapper(semesterController.createGroupSections));

router.post('/createSection/:groupSecId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(CreateSectionRequestDTO),
], asyncWrapper(semesterController.createSection));

router.get('/get/:semesterId', [
	verifyToken,
	permit('ADMIN'),
], asyncWrapper(semesterController.get));

router.get('/getByCurriculum/:curriculumId', [
	verifyToken,
	permit('ADMIN'),
], asyncWrapper(semesterController.getByCurriculum));

router.put('/updateSection/:sectionId', [
	verifyToken,
	permit('ADMIN'),
	validateRequest(UpdateSectionRequestDTO),
], asyncWrapper(semesterController.updateSection));

router.delete('/removeGroupSection/:groupSecId', [verifyToken, permit('ADMIN')], asyncWrapper(semesterController.removeGroupSection));

router.delete('/removeSection/:sectionId', [verifyToken, permit('ADMIN')], asyncWrapper(semesterController.removeSection));

export default router;
