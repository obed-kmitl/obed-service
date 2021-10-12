import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import curriculumRouter from './curriculum';
import courseRouter from './course';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/curriculum', curriculumRouter);
router.use('/course', courseRouter);

export default router;
