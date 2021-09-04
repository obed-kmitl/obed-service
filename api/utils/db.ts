import { Pool } from 'pg';
import dbConfig from '_/config/database';
import logger from '_/middleware/logger';

/**
 * Suggested Project Structure from https://node-postgres.com/guides/project-structure
 */

// create new pool instance
const pool = new Pool(dbConfig);

export default {
	async query(text, params) {
		const start = Date.now();
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		logger.info('executed query', { text, duration, rows: res.rowCount });
		return res;
	},
};
