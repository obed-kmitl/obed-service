import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import { CreateCLORequestDTO } from '_/dtos/clo';

/**
 * Create Course Learning Outcome
 */
const create = async (cloInfo:
	CreateCLORequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO clos (section_id, detail, order_number) 
		VALUES ($1, $2, $3)
		RETURNING *
		`, [
	cloInfo.section_id,
	cloInfo.detail,
	cloInfo.order_number,
]);

export default {
	create,
};
