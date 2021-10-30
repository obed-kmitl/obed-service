import express from 'express';
import standardRouter from './standard';
import authRouter from './auth';
import userRouter from './user';
import curriculumRouter from './curriculum';
import courseRouter from './course';
import mapStandardRouter from './mapStandard';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/curriculum', curriculumRouter);
router.use('/course', courseRouter);
router.use('/standard', standardRouter);
router.use('/mapStandard', mapStandardRouter);

export default router;
