import db from '_/utils/db';
import {
	UserInputDTO,
} from '_/dtos/user';

import { QueryResult, QueryResultRow } from 'pg';

const create = async (userInfo: UserInputDTO): Promise<QueryResultRow> => {
	const userInfoArray = [
		userInfo.email,
		userInfo.username,
		userInfo.password,
		userInfo.prefix,
		userInfo.firstname,
		userInfo.lastname,
		userInfo.role,
	];

	const result: QueryResult = await db.query(`
		INSERT INTO users (email,username,password,prefix,firstname,lastname,role) 
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING email,username,prefix,firstname,lastname,role::text[]
		`, userInfoArray);

	const resultRow : QueryResultRow = result.rows[0];

	return resultRow;
};

const findOne = async (
	userId: number,
): Promise<QueryResultRow> => {
	const userIdArray = [userId];

	const result: QueryResult = await db.query(`
		SELECT *, role::text[]
		FROM users 
		WHERE user_id = $1
	`, userIdArray);

	const resultRow: QueryResultRow = result.rows[0];

	return resultRow;
};

const findOneByUsername = async (
	username: string,
): Promise<QueryResultRow> => {
	const usernameArray = [username];

	const result: QueryResult = await db.query(`
		SELECT *, role::text[]
		FROM users 
		WHERE username = $1
	`, usernameArray);

	const resultRow: QueryResultRow = result.rows[0];

	return resultRow;
};

export default {
	create,
	findOneByUsername,
	findOne,
};
