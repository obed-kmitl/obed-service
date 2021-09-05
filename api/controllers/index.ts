import express from 'express';
import userRouter from './user';
import authRouter from './auth';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
