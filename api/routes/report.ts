import { reportController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';

import express from 'express';

const router = express.Router();

router.get('/generate/:sectionId', [
	verifyToken,
	permit('TEACHER'),
], asyncWrapper(reportController.generate));

router.get('/demo', (req, res) => {
	res.render('api/templates/report.ejs');
});

export default router;
