import { reportController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { SaveReportRequestDTO } from '_/dtos/report';

import express from 'express';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/save/:sectionId', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(SaveReportRequestDTO),
], asyncWrapper(reportController.save));

export default router;