import { assessmentController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { SaveIndividualAssessmentRequestDTO } from '_/dtos/assessment';

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

export default router;
