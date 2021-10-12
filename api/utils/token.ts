import jwt from 'jsonwebtoken';
import authConfig from '_/configs/auth';
import redisClient from '_/utils/redis';

export const GenerateRefreshToken = async (userId: number) => {
	const refreshToken = jwt.sign(
		{ sub: userId },
		authConfig.secret,
		{ expiresIn: authConfig.jwtRefreshExpiration },
	);

	await redisClient.setAsync(userId.toString(), JSON.stringify({ token: refreshToken }));

	return refreshToken;
};

export const GenerateAccessToken = (userId: number) => {
	const accessToken = jwt.sign({ id: userId }, authConfig.secret, {
		expiresIn: authConfig.jwtExpiration,
	});

	return accessToken;
};

export default {
	GenerateRefreshToken,
	GenerateAccessToken,
};
