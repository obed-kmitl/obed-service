import authRepository from '_/repositories/auth';
import { UserInfoDTO } from '_/dtos/user';
import { QueryResult } from 'pg';

const register = async (
	userInfo: UserInfoDTO,
): Promise<QueryResult> => authRepository.register(userInfo)
	.then((result: QueryResult) => result)
	.catch((err: Error) => {
		throw err;
	});

export default {
	register,
};
