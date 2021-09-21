export const extractToken = (req) => {
	const fullAccessToken = req.headers['x-access-token'];
	if (fullAccessToken && fullAccessToken.split(' ')[0] === 'Bearer') {
		return fullAccessToken.split(' ')[1];
	}
	return null;
};
