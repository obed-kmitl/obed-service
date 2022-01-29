import db from '_/utils/db';
import format from 'pg-format';
import { QueryResultRow } from 'pg';
import { MapStandardInputDTO, MapSubStandard } from '_/dtos/mapStandard';

/**
 * Create sub standard
 */
const create = async (mapStandardInfo: MapStandardInputDTO):
Promise<QueryResultRow> => db.transaction(
	() => db.query(`
		DELETE FROM
			map_standards
		WHERE
			curriculum_id = ${mapStandardInfo.curriculum_id}
	`),
	() => db.query(`
		INSERT INTO
				map_standards (curriculum_id, main_std_id, relative_std_id)
		VALUES
				($1, $2, $3) 
		RETURNING * 
	`, [
		mapStandardInfo.curriculum_id,
		mapStandardInfo.main_std_id,
		mapStandardInfo.relative_std_id,
	]),
);

/**
 * Create map sub standard
 */
const createMapSubStandard = async (
	mapSubStandardInfo: MapSubStandard[],
	curriculumId: Number,
): Promise<QueryResultRow> => db.transaction(async () => {
	const { rows: oldMapSubStandards } = await db.query(`
		SELECT 
			*
		FROM 
			map_sub_standards
		WHERE
			curriculum_id = $1
	`, [curriculumId]);

	let toRemove: Number[][] = [];
	oldMapSubStandards.forEach((old) => {
		const findMatch = mapSubStandardInfo
			.find((_new) => old.main_sub_std_id === _new.main_sub_std_id
	&& old.relative_sub_std_id === _new.relative_sub_std_id);
		if (!findMatch) {
			toRemove = [...toRemove, [curriculumId, old.main_sub_std_id, old.relative_sub_std_id]];
		}
	});

	let toAdd: Number[][] = [];
	mapSubStandardInfo.forEach((_new) => {
		const findMatch = oldMapSubStandards
			.find((old) => old.main_sub_std_id === _new.main_sub_std_id
		&& old.relative_sub_std_id === _new.relative_sub_std_id);
		if (!findMatch) {
			toAdd = [...toAdd, [curriculumId, _new.main_sub_std_id, _new.relative_sub_std_id]];
		}
	});

	for (let i = 0; i < toRemove.length; i += 1) {
		await db.query(`
			DELETE FROM
				map_sub_standards 
			WHERE
				curriculum_id = $1
				AND
				main_sub_std_id = $2
				AND
				relative_sub_std_id = $3
		`, toRemove[i]);
	}

	if (toAdd.length > 0) {
		await db.query(format(`
			INSERT INTO 
				map_sub_standards 
				(curriculum_id, main_sub_std_id, relative_sub_std_id) 
			VALUES 
				%L
			`, toAdd));
	}
},
() => db.query(`
				SELECT main_sub_std_id, relative_sub_std_id
				FROM map_sub_standards
				WHERE curriculum_id = ${curriculumId}
			`));

/**
 * Find map standard by currriculumId
 */
const findMapStandard = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
	SELECT
			m_std.*,
			COALESCE(
				json_agg(
					json_build_object('main_sub_std_id', main_sub_std_id, 'relative_sub_std_id', relative_sub_std_id)
				) FILTER (
					WHERE
						relative_sub_std_id IS NOT NULL
						AND
						main_sub_std_id IS NOT NULL
				),
				'[]'
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

/**
 * Find all reletive standard by currriculumId
 */
const findAllRelativeStandard = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
	SELECT
		ms_std.relative_sub_std_id AS sub_std_id,
		s_std.group_sub_std_id,
			s_std.order_number as sub_order_number,
			s_std.group_sub_order_number,
			s_std.title as sub_title,
			s_std.group_sub_title
	FROM
			map_sub_standards ms_std
			LEFT JOIN (
					SELECT
							s_stdx.*,
							gs_std.order_number as group_sub_order_number,
							gs_std.title as group_sub_title
					FROM
							sub_standards s_stdx
							LEFT JOIN group_sub_standards gs_std ON gs_std.group_sub_std_id = s_stdx.group_sub_std_id
					GROUP BY
							gs_std.group_sub_std_id,
							s_stdx.sub_std_id
			) s_std ON s_std.sub_std_id = ms_std.relative_sub_std_id
	WHERE
			ms_std.curriculum_id = $1
	GROUP BY
			ms_std.relative_sub_std_id,
			s_std.sub_std_id,
			s_std.group_sub_std_id,
			s_std.order_number,
			s_std.title,
			s_std.group_sub_order_number,
			s_std.group_sub_title
`, [curriculumId]);

/**
 * Find all map standard by sub_std_id
 */
const findMapStandardBySubStdId = async (
	subStdId :Number[],
	curriculumId: Number,
): Promise<QueryResultRow> => db.query(`
	SELECT
		*
	FROM
		map_sub_standards
	WHERE
		curriculum_id = $1
		AND
		relative_sub_std_id = ANY('{${subStdId.join(', ')}}'::INT[])
	`, [curriculumId]);

/**
 * Find all relative standard by section_id
 */
const findRelativeStandardBySection = async (
	sectionId :number[],
): Promise<QueryResultRow> => db.transaction(async () => {
	const sectionResult = await db.query(`
    SELECT
        *
    FROM
        sections
    WHERE
        section_id = $1
      `, [sectionId]);

	const groupSectionResult = await db.query(`
    SELECT
        *
    FROM
        group_sections
    WHERE
        group_sec_id = $1
      `, [sectionResult.rows[0].group_sec_id]);

	const couseId = groupSectionResult.rows[0].course_id;

	const couseSubStandardResult = await db.query(`
    SELECT
        *
    FROM
        course_sub_standards
    WHERE
        course = $1
    `, [couseId]);

	const mapSubStandardResult = Promise.all(couseSubStandardResult.rows.map(async ({ map_sub_std_id }) => db.query(`
    SELECT
      *
    FROM
      map_sub_standards
    WHERE
      map_sub_std_id = $1
  `, [map_sub_std_id])));

	// const mapSub;
},
async () => {

});

export default {
	create,
	createMapSubStandard,
	findMapStandard,
	findMapStandardBySubStdId,
	findAllRelativeStandard,
	findRelativeStandardBySection,
};
