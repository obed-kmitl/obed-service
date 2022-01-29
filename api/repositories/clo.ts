import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import { CreateCLORequestDTO, UpdateCLORequestDTO } from '_/dtos/clo';
import { format } from 'pg-format';

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

/**
 * Create multiple clo sub standards
 */
const createCLOSubStandards = async (
	cloId: number,	relativeStandardInfo: number[][],
): Promise<QueryResultRow> => db.transaction(async () => {
	await db.query(`
			DELETE FROM
				clo_sub_standards
			WHEREf
				clo_id = $1
		`, [cloId]);
	if (relativeStandardInfo.length > 0) {
		await db.query(format(`
			INSERT INTO
			  clo_sub_standards
				(clo_id, map_sub_std_id)
			VALUES
				%L
			`, relativeStandardInfo));
	}
}, () => ({ success: true }));

const getCurriculumByCLO = async (
	cloId: number,
): Promise<QueryResultRow> => db.transaction(async () => {
	const cloResult = await db.query(`
    SELECT
        *
    FROM
        clos
    WHERE
        clo_id = $1
      `, [cloId]);

	const sectionResult = await db.query(`
    SELECT
        *
    FROM
        sections
    WHERE
        section_id = $1
      `, [cloResult.rows[0].section_id]);

	const groupSectionResult = await db.query(`
    SELECT
        *
    FROM
        group_sections
    WHERE
        group_sec_id = $1
      `, [sectionResult.rows[0].group_sec_id]);

	const courseResult = await db.query(`
      SELECT
          *
      FROM
          courses
      WHERE
          course_id = $1
        `, [groupSectionResult.rows[0].course_id]);

	return courseResult.rows[0].curriculum_id;
}, (curriculumId) => curriculumId);

/**
 * Update Course Learning Outcome
 */
const update = async (cloId: number, cloInfo:
	UpdateCLORequestDTO): Promise<QueryResultRow> => db.query(`
    UPDATE clos
    SET 
      detail = $2,
      order_number = $3
    WHERE clo_id = $1
    RETURNING *
		`, [
	cloId,
	cloInfo.detail,
	cloInfo.order_number,
]);

export default {
	create,
	update,
	createCLOSubStandards,
	getCurriculumByCLO,
};
