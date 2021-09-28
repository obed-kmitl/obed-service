import express from 'express';
import authRouter from './auth';
import userRouter from './user';
import curriculumRouter from './curriculum';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/curriculum', curriculumRouter);

export default router;
