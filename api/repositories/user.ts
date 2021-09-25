import db from '_/utils/db';
import { UserInputDTO } from '_/dtos/user';
import { QueryResultRow } from 'pg';

/**
 * Create user
 */
const createUser = async (user:	 UserInputDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO users (email,username,password,prefix,firstname,lastname,role) 
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING email,username,prefix,firstname,lastname,role::text[]
		`, [
	user.email,
	user.username,
	user.password,
	user.prefix,
	user.firstname,
	user.lastname,
	user.role,
]);

/**
 * Find one user
 */
const find = async (
	userId: number,
): Promise<QueryResultRow> => db.query(`
		SELECT user_id, email, username, prefix, firstname, lastname, g_auth_code, role::text[], created_at, updated_at
		FROM users 
		WHERE user_id = $1
	`, [userId]);

/**
 * Find one user with passwords
 */
const findWithPassword = async (
	userId: number,
): Promise<QueryResultRow> => db.query(`
		SELECT *, role::text[]
		FROM users 
		WHERE user_id = $1
	`, [userId]);

/**
 * Find one of user by username
 */
const findByUsername = async (
	username: string,
): Promise<QueryResultRow> => db.query(`
		SELECT *, role::text[]
		FROM users 
		WHERE username = $1
	`, [username]);

/**
 * Find all users
 */
const findAll = async (): Promise<QueryResultRow> => db.query(`
		SELECT user_id, email, username, prefix, firstname, lastname, g_auth_code, role::text[], created_at, updated_at
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
				role = COALESCE($9,role),
				created_at = COALESCE($10,created_at),
				updated_at = COALESCE($11,updated_at)
		WHERE user_id = $1
		RETURNING user_id, email, username, prefix, firstname, lastname, g_auth_code, role::text[], created_at, updated_at
	`, [
	user.user_id,
	user.email,
	user.username,
	user.password,
	user.prefix,
	user.firstname,
	user.lastname,
	user.g_auth_code,
	user.role,
	user.created_at,
	user.updated_at,
]);

/**
 * Delete one user
 */
const deleteUser = async (userId: number): Promise<QueryResultRow> => db.query(`
		DELETE users
		WHERE user_id = $1
		RETURNING user_id, email, username, prefix, firstname, lastname, g_auth_code, role::text[], created_at, updated_at
	`, [userId]);

export default {
	createUser,
	findByUsername,
	find,
	findAll,
	findWithPassword,
	updateUser,
	deleteUser,
};
