import db from '_/utils/db';
import format from 'pg-format';
import { QueryResultRow } from 'pg';
import { MapStandardInputDTO } from '_/dtos/mapStandard';

/**
 * Create sub standard
 */
const create = async (mapStandardInfo: MapStandardInputDTO): Promise<QueryResultRow> => db.query(`
	INSERT INTO
			map_standards (curriculum_id, main_std_id, relative_std_id)
	VALUES
			($1, $2, $3) ON CONFLICT (curriculum_id, main_std_id, relative_std_id) DO
	UPDATE
	SET
			curriculum_id = $1,
			main_std_id = $2,
			relative_std_id = $3
	RETURNING *
`, [
	mapStandardInfo.curriculum_id,
	mapStandardInfo.main_std_id,
	mapStandardInfo.relative_std_id,
]);

/**
 * Create map sub standard
 */
const createMapSubStandard = async (
	mapSubStandardInfo: Array<Array<any>>,
	curriculumId: Number,
): Promise<QueryResultRow> => {
	const deleteExists = `
		DELETE FROM
			map_sub_standards
		WHERE
			curriculum_id = ${curriculumId}
	`;

	const inserts = format(`
		INSERT INTO 
			map_sub_standards 
			(curriculum_id, main_sub_std_id, relative_sub_std_id) 
		VALUES 
			%L
	`, mapSubStandardInfo);

	const selectAll = `
		SELECT main_sub_std_id, relative_sub_std_id
		FROM map_sub_standards
		WHERE curriculum_id = ${curriculumId}
	`;

	return db.transaction(async () => {
		await db.query(deleteExists);
		await db.query(inserts);
	},
	() => db.query(selectAll));
};

/**
 * Find map standard by currriculumId
 */
const findMapStandard = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
	SELECT
			m_std.*,
			json_agg(
				json_build_object('main_sub_std_id',main_sub_std_id,'relative_sub_std_id', relative_sub_std_id)
			) AS map_sub_standards
	FROM
			map_standards m_std
	LEFT JOIN 
			map_sub_standards ms_std ON ms_std.curriculum_id = $1
	WHERE
			m_std.curriculum_id = $1
	GROUP BY
			m_std.curriculum_id, m_std.main_std_id, m_std.relative_std_id
`, [curriculumId]);

export default {
	create,
	createMapSubStandard,
	findMapStandard,
};
