import authConfig from '_/config/auth';
import userRepository from '_/repositories/user';
import {
	UserDTO,
} from '_/dtos/user';

import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { QueryResultRow } from 'pg';

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' });
	}

	return res.sendStatus(401).send({ message: 'Unauthorized!' });
};

const verifyToken = (req, res, next) : Response => {
	const accessToken = req.headers['x-access-token'];

	if (!accessToken) {
		return res.status(403).send({ message: 'No token provided!' });
	}

	try {
		const decoded = jwt.verify(accessToken, authConfig.secret);
		req.userId = decoded.id;
		next();
	} catch (err) {
		return catchError(err, res);
	}
};

const permit = (...permittedRoles) => async (req, res, next) => {
	const { userId } = req;

	const result: QueryResultRow = await userRepository.findOne(userId);

	const user = new UserDTO(
		result.user_id,
		result.email,
		result.username,
		result.password,
		result.prefix,
		result.firstname,
		result.lastname,
		result.g_auth_co,
		result.role,
		result.created_at,
		result.updated_at,
	);

	if (!user) {
		return res.status(404).send({ message: 'User Not found.' });
	}

	if (permittedRoles.includes(user.role)) {
		next(); // role is allowed, so continue on the next middleware
	} else {
		res.status(403).json({ message: 'Forbidden' }); // user is forbidden
	}
};

export default {
	verifyToken,
	permit,
};
