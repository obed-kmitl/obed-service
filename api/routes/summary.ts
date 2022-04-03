import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';
import { summaryController } from '_/controllers';

import express from 'express';

const router = express.Router();

router.get('/getCLOSummaryBySection/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(summaryController.getCLOSummaryBySection));

router.get('/getPLOSummaryBySection/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(summaryController.getPLOSummaryBySection));

router.get('/getPLOSummaryByStudentAndSection/:sectionId/:studentId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(summaryController.getPLOSummaryByStudentAndSection));

export default router;
