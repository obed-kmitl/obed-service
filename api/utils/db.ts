/* eslint-disable no-useless-catch */
import { Pool } from 'pg';
import dbConfig from '_/configs/db';
import logger from '_/utils/logger';

/**
 * Suggested Project Structure from https://node-postgres.com/guides/project-structure
 */

// create new pool instance
const pool = new Pool(dbConfig);

logger.info('Postgres Database connected');

export default {
	async query(text, params?) {
		try {
			const start = Date.now();
			const res = await pool.query(text, params);
			const duration = Date.now() - start;
			// logger.info('executed query', { text, duration, rows: res.rowCount });
			return res;
		} catch (err) {
			throw err;
		}
	},
	async transaction(fn, callback) {
		try {
			await pool.query('BEGIN;');
			const fnResponse = await fn();
			await pool.query('COMMIT;');
			return callback(fnResponse);
		} catch (err) {
			throw err;
		}
	},
};
