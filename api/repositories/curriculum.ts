import db from '_/utils/db';
import { CreateCurriculumRequestDTO, CurriculumInputDTO } from '_/dtos/curriculum';
import { QueryResultRow } from 'pg';

/**
 * Create currriculum
 */
const createCurriculum = async (curriculumInfo:	 CreateCurriculumRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO curriculums (title) 
		VALUES ($1)
		RETURNING *
		`, [
	curriculumInfo.title,
]);

/**
 * Find currriculum by Id
 */
const findCurriculum = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
		SELECT *
		FROM curriculums
		WHERE curriculum_id = $1
	`, [curriculumId]);

/**
 * Find all curriculums
 */
const findAllCurriculum = async (): Promise<QueryResultRow> => db.query(`
		SELECT *
		FROM curriculums
	`);

/**
 * Update curriculum info
 */
const updateCurriculum = async (curriculumInfo: CurriculumInputDTO): Promise<QueryResultRow> => db.query(`
 UPDATE curriculums
 SET main_standard_id = COALESCE($2,main_standard_id),
 		 relative_standard_id = COALESCE($3,relative_standard_id),
		 title = COALESCE($4,title)
 WHERE curriculum_id = $1
 RETURNING *
`, [
	curriculumInfo.curriculum_id,
	curriculumInfo.main_standard_id,
	curriculumInfo.relative_standard_id,
	curriculumInfo.title,
]);

/**
* Delete one curriculum
*/
const deleteCurriculum = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM curriculums 
 WHERE curriculum_id = $1
 RETURNING *
`, [curriculumId]);

export default {
	createCurriculum,
	findCurriculum,
	findAllCurriculum,
	updateCurriculum,
	deleteCurriculum,
};
