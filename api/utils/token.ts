import authConfig from '_/configs/auth';

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const convertBearer = (token) => `Bearer ${token}`;

export const extractBearer = (token) => {
	if (token && token.split(' ')[0] === 'Bearer') {
		return token.split(' ')[1];
	}
	return null;
};

export const GenerateRefreshToken = async () => crypto.randomBytes(48).toString('hex');

export const GenerateAccessToken = (userId: number) => {
	const accessToken = jwt.sign(
		{ id: userId },
		authConfig.secret,
		{ expiresIn: authConfig.jwtExpiration },
	);

	return convertBearer(accessToken);
};

export default {
	GenerateRefreshToken,
	GenerateAccessToken,
	extractBearer,
	convertBearer,
};
