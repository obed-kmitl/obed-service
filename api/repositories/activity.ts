import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import { CreateActivityRequestDTO, UpdateActivityRequestDTO } from '_/dtos/activity';

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
     *
 FROM
     activities
 WHERE
     category_id = $1
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
          *
      FROM
          activities
      WHERE
          category_id IS NULL
      `, []);

		result = [...result, {
			title: 'unassigned',
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

export default {
	create,
	getAllBySection,
	update,
	remove,
};
