import db from '_/utils/db';
import { RegisterRequestDTO, UserInputDTO } from '_/dtos/user';
import { QueryResultRow } from 'pg';

/**
 * Create user
 */
const createUser = async (user:	 RegisterRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO users (email,username,password,prefix,firstname,lastname,roles) 
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING user_id, email, username, prefix, firstname, lastname, g_auth_code, roles::text[], created_at, updated_at
		`, [
	user.email,
	user.username,
	user.password,
	user.prefix,
	user.firstname,
	user.lastname,
	user.roles,
]);

/**
 * Find one user
 */
const findUser = async (
	userId: number,
): Promise<QueryResultRow> => db.query(`
		SELECT user_id, email, username, prefix, firstname, lastname, g_auth_code, roles::text[], created_at, updated_at
		FROM users 
		WHERE user_id = $1
	`, [userId]);

/**
 * Find one user with passwords
 */
const findUserWithPassword = async (
	userId: number,
): Promise<QueryResultRow> => db.query(`
		SELECT *, roles::text[]
		FROM users 
		WHERE user_id = $1
	`, [userId]);

/**
 * Find one of user by username
 */
const findUserByUsername = async (
	username: string,
): Promise<QueryResultRow> => db.query(`
		SELECT *, roles::text[]
		FROM users 
		WHERE username = $1
	`, [username]);

/**
 * Find all users
 */
const findAllUser = async (): Promise<QueryResultRow> => db.query(`
		SELECT user_id, email, username, prefix, firstname, lastname, g_auth_code, roles::text[], created_at, updated_at
		FROM users 
	`);

/**
 * Update user info
 */
const updateUser = async (user: UserInputDTO): Promise<QueryResultRow> => db.query(`
		UPDATE users
		SET email = COALESCE($2,email),
				username = COALESCE($3,username),
				password = COALESCE($4,password),
				prefix = COALESCE($5,prefix),
				firstname = COALESCE($6,firstname),
				lastname = COALESCE($7,lastname),
				g_auth_code = COALESCE($8,g_auth_code),
				roles = COALESCE($9,roles)
		WHERE user_id = $1
		RETURNING user_id, email, username, prefix, firstname, lastname, g_auth_code, roles::text[], created_at, updated_at
	`, [
	user.user_id,
	user.email,
	user.username,
	user.password,
	user.prefix,
	user.firstname,
	user.lastname,
	user.g_auth_code,
	user.roles,
]);

/**
 * Delete one user
 */
const deleteUser = async (userId: number): Promise<QueryResultRow> => db.query(`
		DELETE FROM users
		WHERE user_id = $1
		RETURNING user_id, email, username, prefix, firstname, lastname, g_auth_code, roles::text[], created_at, updated_at
	`, [userId]);

export default {
	createUser,
	findUserByUsername,
	findUser,
	findAllUser,
	findUserWithPassword,
	updateUser,
	deleteUser,
};
