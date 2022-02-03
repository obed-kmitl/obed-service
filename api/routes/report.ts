import { reportController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';

import express from 'express';

const router = express.Router();

router.get('/generate/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(reportController.generate));

router.get('/demo', asyncWrapper(reportController.demo));

// router.get('/demo', (req, res) => {
// 	res.render('report');
// });

export default router;
