import authConfig from '_/config/auth';
import userRepository from '_/repositories/user';
import { extractToken } from '_/utils/extractToken';

import jwt from 'jsonwebtoken';
import { Response } from 'express';

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' });
	}

	return res.sendStatus(401).send({ message: 'Unauthorized!' });
};

const verifyToken = (req, res, next) : Response => {
	const accessToken = extractToken(req);

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

	const result = await userRepository.find(userId);
	const userResult = result.rows[0];

	if (!userResult) {
		return res.status(404).send({ message: 'User Not found.' });
	}

	const hasPermission:boolean = permittedRoles.every((val) => userResult.role.includes(val));

	if (hasPermission) {
		next(); // role is allowed, so continue on the next middleware
	} else {
		return res.status(403).json({ message: 'No permission!' }); // user is forbidden
	}
};

export default {
	verifyToken,
	permit,
};
