import db from '_/utils/db';
import {
	UserInputDTO,
	UserOutputDTO,
} from '_/dtos/user';

import { QueryResult, QueryResultRow } from 'pg';

const createUser = async (userInfo: UserInputDTO): Promise<QueryResultRow> => {
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

const find = async (
	userId: number,
): Promise<QueryResultRow> => {
	const userIdArray = [userId];

	const result: QueryResult = await db.query(`
		SELECT user_id, email, username, prefix, firstname, lastname, g_auth_code, role::text[], created_at, updated_at
		FROM users 
		WHERE user_id = $1
	`, userIdArray);

	const resultRow: QueryResultRow = result.rows[0];

	return resultRow;
};

const findWithPassword = async (
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

const findByUsername = async (
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

const findAll = async (): Promise<QueryResultRow> => {
	const result: QueryResult = await db.query(`
		SELECT user_id, email, username, prefix, firstname, lastname, g_auth_code, role::text[], created_at, updated_at
		FROM users 
	`);

	const resultRows: QueryResultRow[] = result.rows;

	return resultRows;
};

const updatePassword = async (userId: string, password: string): Promise<QueryResultRow> => {
	const queryValueArray = [
		password,
		userId,
	];

	return db.query(`
		UPDATE users
		SET password = $1
		WHERE user_id = $2;
	`, queryValueArray);
};

const updateUser = async (userProfile: UserOutputDTO): Promise<QueryResultRow> => {
	const queryValueArray = [
		userProfile.user_id,
		userProfile.email,
		userProfile.username,
		userProfile.password,
		userProfile.prefix,
		userProfile.firstname,
		userProfile.lastname,
		userProfile.g_auth_code,
		userProfile.role,
		userProfile.created_at,
		userProfile.updated_at,
	];

	return db.query(`
		UPDATE users
		SET email = COALESCE($2,email),
				username = COALESCE($3,username),
				password = COALESCE($4,password),
				prefix = COALESCE($5,prefix),
				firstname = COALESCE($6,firstname),
				lastname = COALESCE($7,lastname),
				g_auth_code = COALESCE($8,g_auth_code),
				role = COALESCE($9,role),
				created_at = COALESCE($10,created_at),
				updated_at = COALESCE($11,updated_at)
		WHERE user_id = $1
	`, queryValueArray);
};

const deleteUser = async (userId: number): Promise<QueryResultRow> => db.query(`
		DELETE users
		WHERE user_id = $1
	`, [userId]);

export default {
	createUser,
	findByUsername,
	find,
	findAll,
	updatePassword,
	findWithPassword,
	updateUser,
	deleteUser,
};
