import { Pool } from 'pg';
import dbConfig from '_/config/db';
import logger from '_/utils/logger';

/**
 * Suggested Project Structure from https://node-postgres.com/guides/project-structure
 */

// create new pool instance
const pool = new Pool(dbConfig);

logger.info('Postgres Database connected');

export default {
	async query(text, params?) {
		const start = Date.now();
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		// logger.info('executed query', { text, duration, rows: res.rowCount });
		return res;
	},
};
