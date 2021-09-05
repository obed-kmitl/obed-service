import db from '_/utils/db';
import { UserInfoDTO, UserInfoArrayDTO } from '_/dtos/user';
import { QueryResult } from 'pg';

const register = async (userInfo: UserInfoDTO): Promise<QueryResult> => {
	const userInfoValues: UserInfoArrayDTO = [
		userInfo.email,
		userInfo.username,
		userInfo.password,
		userInfo.prefix,
		userInfo.firstname,
		userInfo.lastname,
		userInfo.role,
	];

	return db.query('INSERT INTO users (email,username,password,prefix,firstname,lastname,role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
		userInfoValues)
		.then((res: QueryResult) => res.rows[0])
		.catch((err: Error) => { throw err; });
};

export default {
	register,
};
