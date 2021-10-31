import db from '_/utils/db';
import { CreateCurriculumRequestDTO, CurriculumInputDTO } from '_/dtos/curriculum';
import { QueryResultRow } from 'pg';

/**
 * Create currriculum
 */
const createCurriculum = async (curriculumInfo:	 CreateCurriculumRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO curriculums (title, university, department, faculty) 
		VALUES ($1, $2, $3, $4)
		RETURNING *
		`, [
	curriculumInfo.title,
	curriculumInfo.university,
	curriculumInfo.department,
	curriculumInfo.faculty,
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
 SET 
 		title = COALESCE($2,title),
		university = COALESCE($3,university),
		department = COALESCE($4,	department),
		faculty = COALESCE($5,faculty)
 WHERE curriculum_id = $1
 RETURNING *
`, [
	curriculumInfo.curriculum_id,
	curriculumInfo.title,
	curriculumInfo.university,
	curriculumInfo.department,
	curriculumInfo.faculty,
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
