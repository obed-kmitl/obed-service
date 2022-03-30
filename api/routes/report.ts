import express from 'express';
import { reportController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { SaveReportRequestDTO } from '_/dtos/report';
import { validateRequest } from '_/middleware/validationHandler';

const router = express.Router();

router.post('/save', [
	verifyToken,
	permit('TEACHER'),
	validateRequest(SaveReportRequestDTO),
], asyncWrapper(reportController.save));

router.get('/getReportBySection/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(reportController.getReportBySection));

router.get('/getSectionReport/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(reportController.getSectionReport));

router.get('/generate/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(reportController.generate));

router.get('/demo', asyncWrapper(reportController.demo));

export default router;
