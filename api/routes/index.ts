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
import cloRouter from './clo';
import studentRouter from './student';
import assessmentRouter from './assessment';
import reportRouter from './report';
import summaryRouter from './summary';
import dropdownRouter from './dropdown';
import googleRouter from './google';

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
router.use('/clo', cloRouter);
router.use('/student', studentRouter);
router.use('/assessment', assessmentRouter);
router.use('/report', reportRouter);
router.use('/summary', summaryRouter);
router.use('/dropdown', dropdownRouter);
router.use('/google', googleRouter);

export default router;
