import { dropdownController } from '_/controllers';
import { verifyToken, permit } from '_/middleware/authorizationHandler';
import asyncWrapper from '_/middleware/asyncWrapper';

import express from 'express';

const router = express.Router();

router.get('/semester/:curriculumId', [verifyToken, permit('ADMIN', 'TEACHER')], asyncWrapper(dropdownController.getSemester));
router.get('/course/:semesterId', [verifyToken, permit('ADMIN', 'TEACHER')], asyncWrapper(dropdownController.getCourse));
router.get('/studentNumber/:curriculumId', [verifyToken, permit('ADMIN', 'TEACHER')], asyncWrapper(dropdownController.getStudentNumber));

export default router;
