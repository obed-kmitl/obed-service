import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import { CreateActivityRequestDTO } from '_/dtos/activity';

/**
 * Create activity
 */
const create = async (activityInfo:
	CreateActivityRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO activities (section_id, category_id, title, detail, type) 
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
		`, [
	activityInfo.section_id,
	activityInfo.category_id,
	activityInfo.title,
	activityInfo.detail,
	activityInfo.type,
]);

export default {
	create,
};
