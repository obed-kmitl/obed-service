import express from 'express';
import asyncWrapper from '_/middleware/async-wrapper';
import authService from '_/services/auth';

const { router } = express;

router.post('/signup',
	asyncWrapper(async (req, res) => {
		res.status(200).send(await authService.signup(req.body));
	}));

export default router;
