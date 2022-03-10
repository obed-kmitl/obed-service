import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import {
	CreateActivityRequestDTO, UpdateActivityRequestDTO,
	CreateSubActivityRequestDTO, UpdateSubActivityRequestDTO,
} from '_/dtos/activity';

import format from 'pg-format';
import { categoryRepository } from '.';

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

/**
 * Get all activities by categoryId
 */
const getAllByCategory = async (categoryId: number): Promise<QueryResultRow> => db.query(`
SELECT
    a.*,
    COALESCE(
        json_agg(
            json_build_object(
                'sub_activity_id',
                sa.sub_activity_id,
                'detail',
                sa.detail,
                'max_score',
                sa.max_score
            )
        ) FILTER (
            WHERE
                sa.sub_activity_id IS NOT NULL
        ),
        '[]'
    ) AS sub_activities,
    SUM(sa.max_score) as total_max_score
FROM
    activities a
    LEFT JOIN sub_activities sa ON sa.activity_id = a.activity_id
WHERE
    category_id = $1
GROUP BY
    a.activity_id
   `, [categoryId]);

/**
 * Get all activities by section
 */
const getAllBySection = async (sectionId: number): Promise<QueryResultRow> => db.transaction(
	async () => {},
	async () => {
		const categoryResult = await categoryRepository.getAllBySection(sectionId);
		const categories : any[] = categoryResult.rows;

		let result = [...categories];
		for (let i = 0; i < categories.length; i += 1) {
			const activityResult = await getAllByCategory(categories[i].category_id);
			result[i] = { ...result[i], activities: activityResult.rows };
		}

		const activityResult = await db.query(`
    SELECT
        a.*,
        COALESCE(
            json_agg(
                json_build_object(
                    'sub_activity_id',
                    sa.sub_activity_id,
                    'detail',
                    sa.detail,
                    'max_score',
                    sa.max_score
                )
            ) FILTER (
                WHERE
                    sa.sub_activity_id IS NOT NULL
            ),
            '[]'
        ) AS sub_activities,
        SUM(sa.max_score) as total_max_score
    FROM
        activities a
        LEFT JOIN sub_activities sa ON sa.activity_id = a.activity_id
    WHERE
        category_id IS NULL AND
        section_id = $1
    GROUP BY
        a.activity_id
      `, [sectionId]);

		result = [...result, {
			title: 'Unassigned',
			activities: activityResult.rows,
		}];

		return result;
	},
);

/**
 * Update activity
 */
const update = async (activityInfo:
	UpdateActivityRequestDTO, activityId: number): Promise<QueryResultRow> => db.query(`
    UPDATE activities
    SET 
      category_id = $2,
      title = $3,
      detail = $4,
      type = $5
    WHERE activity_id = $1
    RETURNING *
		`, [
	activityId,
	activityInfo.category_id,
	activityInfo.title,
	activityInfo.detail,
	activityInfo.type,
]);

/**
 * Remove activity
 */
const remove = async (activityId: number): Promise<QueryResultRow> => db.query(`
  DELETE FROM activities 
  WHERE activity_id = $1
  RETURNING *
		`, [activityId]);

/**
 * Create sub activity
 */
const createSubActivity = async (subActivityInfo:
	CreateSubActivityRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO sub_activities (activity_id,  detail, max_score) 
		VALUES ($1, $2, $3)
		RETURNING *
		`, [
	subActivityInfo.activity_id,
	subActivityInfo.detail,
	subActivityInfo.max_score,
]);

/**
 * Find sub activity
 */
const findSubActivity = async (subActivityId:
	number): Promise<QueryResultRow> => db.query(`
	SELECT
    sa.*,
    COALESCE(
        json_agg(
            json_build_object(
                'clo_id',
                sac.clo_id,
                'detail',
                sac.detail,
                'order_number',
                sac.order_number
            )
        ) FILTER (
            WHERE
                sac.clo_id IS NOT NULL
        ),
        '[]'
    ) AS clos
FROM
    sub_activities sa
    LEFT JOIN (
        SELECT
            sacx.clo_id,
            sacx.sub_activity_id,
            c.clo_id as clo_id_temp,
            c.detail,
            c.order_number
        FROM
            sub_activities_clo sacx
            LEFT JOIN clos c ON c.clo_id = sacx.clo_id
    ) sac ON sac.sub_activity_id = sa.sub_activity_id
WHERE
    sa.sub_activity_id = $1
GROUP BY
    sa.sub_activity_id
		`, [
	subActivityId,
]);

/**
 * Create multiple sub activities clo
 */
const createSubActivitiesCLO = async (
	subActivityId: number,	cloArray: number[][],
): Promise<QueryResultRow> => db.transaction(async () => {
	await db.query(`
			DELETE FROM
				sub_activities_clo
			WHERE
        sub_activity_id = $1
		`, [subActivityId]);
	if (cloArray.length > 0) {
		await db.query(format(`
			INSERT INTO
        sub_activities_clo
				(sub_activity_id, clo_id)
			VALUES
				%L
			`, cloArray));
	}
	return { subActivityId };
}, (result) => findSubActivity(result.subActivityId));

/**
 * Update sub activity
 */
const updateSubActivity = async (subActivityId: number, subActivityInfo:
	UpdateSubActivityRequestDTO): Promise<QueryResultRow> => db.query(`
    UPDATE sub_activities
    SET 
      detail = $2,
      max_score = $3
    WHERE sub_activity_id = $1
    RETURNING *
		`, [
	subActivityId,
	subActivityInfo.detail,
	subActivityInfo.max_score,
]);

/**
 * Find all sub activity
 */
const findAllSubActivity = async (activityId:
	number): Promise<QueryResultRow> => db.query(`
	SELECT
    sa.*,
    COALESCE(
        json_agg(
            json_build_object(
                'clo_id',
                sac.clo_id,
                'detail',
                sac.detail,
                'order_number',
                sac.order_number
            )
        ) FILTER (
            WHERE
                sac.clo_id IS NOT NULL
        ),
        '[]'
    ) AS clos
FROM
    sub_activities sa
    LEFT JOIN (
        SELECT
            sacx.clo_id,
            sacx.sub_activity_id,
            c.clo_id as clo_id_temp,
            c.detail,
            c.order_number
        FROM
            sub_activities_clo sacx
            LEFT JOIN clos c ON c.clo_id = sacx.clo_id
    ) sac ON sac.sub_activity_id = sa.sub_activity_id
WHERE
    sa.activity_id = $1
GROUP BY
    sa.sub_activity_id
ORDER BY
    sa.sub_activity_id
		`, [
	activityId,
]);

/**
 * Remove sub activity
 */
const removeSubActivity = async (subActivityId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM sub_activities 
 WHERE sub_activity_id = $1
 RETURNING *
   `, [subActivityId]);

/**
 * Get  activity
 */
const find = async (activityId: number): Promise<QueryResultRow> => db.query(`
SELECT
    *
FROM
    activities
WHERE
    activity_id = $1
  `, [activityId]);

/**
 * findฺSubActivityByClo
 */
const findฺSubActivityByClo = async (cloId: number): Promise<QueryResultRow> => db.query(`
SELECT
    sa.sub_activity_id,
    sa.detail,
    sa.max_score,
    a.activity_id,
    a.title as activity_title,
    a.detail as activity_detail
FROM
    sub_activities_clo sac
    LEFT JOIN sub_activities sa ON sa.sub_activity_id = sac.sub_activity_id
    LEFT JOIN activities a ON a.activity_id = sa.activity_id
WHERE
    sac.clo_id = $1
   `, [cloId]);

export default {
	create,
	getAllBySection,
	update,
	remove,
	createSubActivity,
	createSubActivitiesCLO,
	updateSubActivity,
	findAllSubActivity,
	removeSubActivity,
	find,
	findฺSubActivityByClo,
};
