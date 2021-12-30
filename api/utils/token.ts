import jwt from 'jsonwebtoken';
import authConfig from '_/configs/auth';
import crypto from 'crypto';

export const GenerateRefreshToken = async () => crypto.randomBytes(48).toString('hex');

export const GenerateAccessToken = (userId: number) => {
	const accessToken = jwt.sign(
		{ id: userId },
		authConfig.secret,
		{ expiresIn: authConfig.jwtExpiration },
	);

	return accessToken;
};

export default {
	GenerateRefreshToken,
	GenerateAccessToken,
};
