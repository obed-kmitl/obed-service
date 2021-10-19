import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import {
	CreateStandardRequestDTO,
	CreateGroupSubStandardRequestDTO,
	CreateSubStandardRequestDTO,
	StandardInputDTO,
	GroupSubStandardInputDTO,
	SubStandardInputDTO,
} from '_/dtos/standard';

/**
 * Create Standard
 */
const create = async (standardInfo: CreateStandardRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO
				standards (curriculum_id, title)
		VALUES
				($1, $2) 
		RETURNING *
`, [
	standardInfo.curriculum_id,
	standardInfo.title,
]);

/**
 * Create Group Sub Standard
 */
const creatGroupSubStandard = async (groupSubStandardInfo: CreateGroupSubStandardRequestDTO): Promise<QueryResultRow> => db.query(`
 INSERT INTO group_sub_standards (standard_id, order_number, title)
 VALUES ($1, $2, $3)
 RETURNING *
`, [
	groupSubStandardInfo.standard_id,
	groupSubStandardInfo.order_number,
	groupSubStandardInfo.title,
]);

/**
 * Create Sub Standard
 */
const creatSubStandard = async (groupSubStandardInfo: CreateSubStandardRequestDTO): Promise<QueryResultRow> => db.query(`
 INSERT INTO sub_standards (group_sub_std_id, order_number, title)
 VALUES ($1, $2, $3)
 RETURNING *
`, [
	groupSubStandardInfo.group_sub_std_id,
	groupSubStandardInfo.order_number,
	groupSubStandardInfo.title,
]);

/**
 * Find standard by standardId
 */
const findStandard = async (standardId: number): Promise<QueryResultRow> => db.query(`
	SELECT
			m_std.*,
			COALESCE(
					json_agg(gs_std.*) FILTER (
							WHERE
									gs_std.group_sub_std_id IS NOT NULL
					),
					'[]'
			) AS group_sub_standards
	FROM
			standards m_std
			LEFT JOIN (
					SELECT
							gss.*,
							COALESCE(
									json_agg(s_std.* ORDER BY s_std.order_number) FILTER (
											WHERE
													s_std.sub_std_id IS NOT NULL
									),
									'[]'
							) AS sub_standards
					FROM
							group_sub_standards gss
							LEFT JOIN sub_standards s_std ON gss.group_sub_std_id = s_std.group_sub_std_id
					GROUP BY
							gss.group_sub_std_id
					ORDER BY
							gss.order_number ASC
			) gs_std ON m_std.standard_id = gs_std.standard_id
	WHERE
			m_std.standard_id = $1
	GROUP BY
			m_std.standard_id
`, [standardId]);

/**
 * Find standard by currriculumId
 */
const findAllByCurriculum = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
	SELECT
			m_std.*,
			COALESCE(
					json_agg(gs_std.*) FILTER (
							WHERE
									gs_std.group_sub_std_id IS NOT NULL
					),
					'[]'
			) AS group_sub_standards
	FROM
			standards m_std
			LEFT JOIN (
					SELECT
							gss.*,
							COALESCE(
									json_agg(s_std.* ORDER BY s_std.order_number) FILTER (
											WHERE
													s_std.sub_std_id IS NOT NULL
									),
									'[]'
							) AS sub_standards
					FROM
							group_sub_standards gss
							LEFT JOIN sub_standards s_std ON s_std.group_sub_std_id = gss.group_sub_std_id
					GROUP BY
							gss.group_sub_std_id
					ORDER BY
							gss.order_number ASC
			) gs_std ON gs_std.standard_id = m_std.standard_id
	WHERE
			curriculum_id = $1
	GROUP BY
			m_std.standard_id
`, [curriculumId]);

/**
 * Update standard info
 */
const updateStandard = async (standardInfo: StandardInputDTO): Promise<QueryResultRow> => db.query(`
 UPDATE standards
 SET title = COALESCE($2,title)
 WHERE standard_id = $1
 RETURNING *
`, [
	standardInfo.standard_id,
	standardInfo.title,
]);

/**
 * Update group sub standard info
 */
const updateGroupSubStandard = async (groupSubStandardInfo: GroupSubStandardInputDTO): Promise<QueryResultRow> => db.query(`
 UPDATE group_sub_standards
 SET 
 		order_number = COALESCE($2,order_number),
 		title = COALESCE($3,title)
 WHERE group_sub_std_id = $1
 RETURNING *
`, [
	groupSubStandardInfo.group_sub_std_id,
	groupSubStandardInfo.order_number,
	groupSubStandardInfo.title,
]);

/**
 * Update sub standard info
 */
const updateSubStandard = async (SubStandardInfo: SubStandardInputDTO): Promise<QueryResultRow> => db.query(`
 UPDATE sub_standards
 SET 
 		order_number = COALESCE($2,order_number),
 		title = COALESCE($3,title)
 WHERE sub_std_id = $1
 RETURNING *
`, [
	SubStandardInfo.sub_std_id,
	SubStandardInfo.order_number,
	SubStandardInfo.title,
]);

/**
* Delete one standard
*/
const deleteStandard = async (standardId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM standards 
 WHERE standard_id = $1
 RETURNING *
`, [standardId]);

/**
* Delete one group sub standard
*/
const deleteGroupSubStandard = async (groupSubStdId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM group_sub_standards 
 WHERE group_sub_std_id = $1
 RETURNING *
`, [groupSubStdId]);

/**
* Delete one sub standard
*/
const deleteSubStandard = async (subStdId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM sub_standards 
 WHERE sub_std_id = $1
 RETURNING *
`, [subStdId]);

export default {
	 create,
	 creatGroupSubStandard,
	 creatSubStandard,
	 findStandard,
	 findAllByCurriculum,
	 updateStandard,
	 updateGroupSubStandard,
	 updateSubStandard,
	 deleteStandard,
	 deleteGroupSubStandard,
	 deleteSubStandard,
};
