import { assessmentController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import {
	SaveIndividualAssessmentRequestDTO, CreateGroupRequestDTO,
	AssignGroupRequestDTO, UnassignGroupRequestDTO,
} from '_/dtos/assessment';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/saveIndividual', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(SaveIndividualAssessmentRequestDTO),
], asyncWrapper(assessmentController.saveIndividual));

router.get('/getAllIndividualByActivity/:sectionId/:activityId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(assessmentController.getAllIndividualByActivity));

router.post('/createGroup/:activityId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(CreateGroupRequestDTO),
], asyncWrapper(assessmentController.createGroup));

router.post('/assignGroup/:groupId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(AssignGroupRequestDTO),
], asyncWrapper(assessmentController.assignGroup));

router.get('/getAllGroupByActivity/:activityId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(assessmentController.getAllGroupByActivity));

router.post('/unassignGroup/:groupId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(UnassignGroupRequestDTO),
], asyncWrapper(assessmentController.unassignGroup));

export default router;
