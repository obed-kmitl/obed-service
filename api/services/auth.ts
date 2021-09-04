import authRepository from '_/repositories/auth';

const signup = (userInfo) => {
	authRepository.createUser(userInfo);
};

export default {
	signup,
};
