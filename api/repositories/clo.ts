import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import { CreateCLORequestDTO, UpdateCLORequestDTO } from '_/dtos/clo';
import format from 'pg-format';

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
 * Find Course Learning Outcome
 */
const find = async (cloId: number): Promise<QueryResultRow> => db.query(`
 SELECT
     clo.clo_id,
     clo.order_number,
     clo.detail,
     COALESCE(
         json_agg(clo_ss.main_sub_standard) FILTER (
             WHERE
                 clo_ss.main_sub_standard IS NOT NULL
         ),
         '[]'
     ) AS main_sub_standards,
     COALESCE(
         json_agg(clo_ss.relative_sub_standard) FILTER (
             WHERE
                 clo_ss.relative_sub_standard IS NOT NULL
         ),
         '[]'
     ) AS relative_sub_standards
 FROM
     clos clo
     LEFT JOIN (
         SELECT
             clo_ssx.clo_id,
             clo_ssx.map_sub_std_id,
             mss.main_sub_standard,
             mss.relative_sub_standard
         FROM
             clo_sub_standards clo_ssx
             LEFT JOIN (
                 SELECT
                     mssx.map_sub_std_id map_sub_std_id_x,
                     mssx.main_sub_std_id,
                     mssx.relative_sub_std_id,
                     json_build_object(
                         'sub_std_id',
                         main_ss.sub_std_id,
                         'sub_title',
                         main_ss.sub_title,
                         'sub_order_number',
                         main_ss.sub_order_number,
                         'group_sub_std_id',
                         main_ss.group_sub_std_id,
                         'group_sub_title',
                         main_ss.group_sub_title,
                         'group_sub_order_number',
                         main_ss.group_sub_order_number
                     ) main_sub_standard,
                     json_build_object(
                         'sub_std_id',
                         relative_ss.sub_std_id,
                         'sub_title',
                         relative_ss.sub_title,
                         'sub_order_number',
                         relative_ss.sub_order_number,
                         'group_sub_std_id',
                         relative_ss.group_sub_std_id,
                         'group_sub_title',
                         relative_ss.group_sub_title,
                         'group_sub_order_number',
                         relative_ss.group_sub_order_number
                     ) relative_sub_standard
                 FROM
                     map_sub_standards mssx
                     LEFT JOIN (
                         SELECT
                             ssx.sub_std_id,
                             ssx.order_number AS sub_order_number,
                             ssx.title AS sub_title,
                             gss.group_sub_std_id,
                             gss.order_number AS group_sub_order_number,
                             gss.title AS group_sub_title
                         FROM
                             sub_standards ssx
                             LEFT JOIN group_sub_standards gss ON gss.group_sub_std_id = ssx.group_sub_std_id
                     ) main_ss ON main_ss.sub_std_id = mssx.main_sub_std_id
                     LEFT JOIN (
                         SELECT
                             ssx.sub_std_id,
                             ssx.order_number AS sub_order_number,
                             ssx.title AS sub_title,
                             gss.group_sub_std_id,
                             gss.order_number AS group_sub_order_number,
                             gss.title AS group_sub_title
                         FROM
                             sub_standards ssx
                             LEFT JOIN group_sub_standards gss ON gss.group_sub_std_id = ssx.group_sub_std_id
                     ) relative_ss ON relative_ss.sub_std_id = mssx.main_sub_std_id
             ) mss ON mss.map_sub_std_id_x = clo_ssx.map_sub_std_id
     ) clo_ss ON clo_ss.clo_id = clo.clo_id
 WHERE
     clo.clo_id = $1
 GROUP BY
     clo.clo_id,
     clo_ss.clo_id
      `, [
	cloId,
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
			WHERE
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
	return cloId;
}, (returnCloId) => find(returnCloId));

const findCurriculumByCLO = async (
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
 * Find all Course Learning Outcome
 */
const findAllBySection = async (sectionId: number): Promise<QueryResultRow> => db.query(`
SELECT
    clo.clo_id,
    clo.order_number,
    clo.detail,
    COALESCE(
        json_agg(clo_ss.main_sub_standard) FILTER (
            WHERE
                clo_ss.main_sub_standard IS NOT NULL
        ),
        '[]'
    ) AS main_sub_standards,
    COALESCE(
        json_agg(clo_ss.relative_sub_standard) FILTER (
            WHERE
                clo_ss.relative_sub_standard IS NOT NULL
        ),
        '[]'
    ) AS relative_sub_standards
FROM
    clos clo
    LEFT JOIN (
        SELECT
            clo_ssx.clo_id,
            clo_ssx.map_sub_std_id,
            mss.main_sub_standard,
            mss.relative_sub_standard
        FROM
            clo_sub_standards clo_ssx
            LEFT JOIN (
                SELECT
                    mssx.map_sub_std_id map_sub_std_id_x,
                    mssx.main_sub_std_id,
                    mssx.relative_sub_std_id,
                    json_build_object(
                        'sub_std_id',
                        main_ss.sub_std_id,
                        'sub_title',
                        main_ss.sub_title,
                        'sub_order_number',
                        main_ss.sub_order_number,
                        'group_sub_std_id',
                        main_ss.group_sub_std_id,
                        'group_sub_title',
                        main_ss.group_sub_title,
                        'group_sub_order_number',
                        main_ss.group_sub_order_number
                    ) main_sub_standard,
                    json_build_object(
                        'sub_std_id',
                        relative_ss.sub_std_id,
                        'sub_title',
                        relative_ss.sub_title,
                        'sub_order_number',
                        relative_ss.sub_order_number,
                        'group_sub_std_id',
                        relative_ss.group_sub_std_id,
                        'group_sub_title',
                        relative_ss.group_sub_title,
                        'group_sub_order_number',
                        relative_ss.group_sub_order_number
                    ) relative_sub_standard
                FROM
                    map_sub_standards mssx
                    LEFT JOIN (
                        SELECT
                            ssx.sub_std_id,
                            ssx.order_number AS sub_order_number,
                            ssx.title AS sub_title,
                            gss.group_sub_std_id,
                            gss.order_number AS group_sub_order_number,
                            gss.title AS group_sub_title
                        FROM
                            sub_standards ssx
                            LEFT JOIN group_sub_standards gss ON gss.group_sub_std_id = ssx.group_sub_std_id
                    ) main_ss ON main_ss.sub_std_id = mssx.main_sub_std_id
                    LEFT JOIN (
                        SELECT
                            ssx.sub_std_id,
                            ssx.order_number AS sub_order_number,
                            ssx.title AS sub_title,
                            gss.group_sub_std_id,
                            gss.order_number AS group_sub_order_number,
                            gss.title AS group_sub_title
                        FROM
                            sub_standards ssx
                            LEFT JOIN group_sub_standards gss ON gss.group_sub_std_id = ssx.group_sub_std_id
                    ) relative_ss ON relative_ss.sub_std_id = mssx.main_sub_std_id
            ) mss ON mss.map_sub_std_id_x = clo_ssx.map_sub_std_id
    ) clo_ss ON clo_ss.clo_id = clo.clo_id
WHERE
    section_id = $1
GROUP BY
    clo.clo_id,
    clo_ss.clo_id
		`, [
	sectionId,
]);

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

/**
* Delete one CLO
*/
const deleteCLO = async (cloId: string): Promise<QueryResultRow> => db.query(`
 DELETE FROM clos 
 WHERE clo_id = $1
 RETURNING *
`, [cloId]);

export default {
	create,
	update,
	createCLOSubStandards,
	findCurriculumByCLO,
	deleteCLO,
	findAllBySection,
	find,
};
