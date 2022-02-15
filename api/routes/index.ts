import express from 'express';
import standardRouter from './standard';
import authRouter from './auth';
import userRouter from './user';
import curriculumRouter from './curriculum';
import courseRouter from './course';
import mapStandardRouter from './mapStandard';
import semesterRouter from './semester';
import activityRouter from './activity';
import categoryRouter from './category';
import reportRouter from './report';
import cloRouter from './clo';
import studentRouter from './student';
import assessmentRouter from './assessment';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/curriculum', curriculumRouter);
router.use('/course', courseRouter);
router.use('/standard', standardRouter);
router.use('/mapStandard', mapStandardRouter);
router.use('/semester', semesterRouter);
router.use('/activity', activityRouter);
router.use('/category', categoryRouter);
router.use('/report', reportRouter);
router.use('/clo', cloRouter);
router.use('/student', studentRouter);
router.use('/assessment', assessmentRouter);

export default router;
