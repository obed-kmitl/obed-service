import express from 'express';
import standardRouter from './standard';
import authRouter from './auth';
import userRouter from './user';
import curriculumRouter from './curriculum';
import courseRouter from './course';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/curriculum', curriculumRouter);
router.use('/course', courseRouter);
router.use('/standard', standardRouter);

export default router;
