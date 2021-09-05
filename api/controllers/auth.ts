import express, { Request, Response } from 'express';
import asyncWrapper from '_/middleware/async-wrapper';
import authService from '_/services/auth';
import { UserInfoDTO } from '_/dtos/user';
import { QueryResult } from 'pg';

const router = express.Router();

router.post('/register',
	asyncWrapper(async (req: Request, res: Response): Promise<Response> => {
		const userInfo: UserInfoDTO = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			prefix: req.body.prefix,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			role: 'teacher',
		};

		await authService.register(userInfo)
			.then((result: QueryResult) => res.status(200).json({ message: 'Register success!', data: result }))
			.catch((err: Error) => res.status(400).json({ message: 'Something went wrong.', data: err }));
	}));

export default router;
