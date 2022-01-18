import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from '_/dtos/category';

/**
 * Create category
 */
const create = async (categoryInfo:
	CreateCategoryRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO categories (section_id, title, weight) 
		VALUES ($1, $2, $3)
		RETURNING *
		`, [
	categoryInfo.section_id,
	categoryInfo.title,
	categoryInfo.weight,
]);

/**
 * Get all categories by sectionId
 */
const getAllBySection = async (sectionId: number): Promise<QueryResultRow> => db.query(`
  SELECT
      *
  FROM
      categories
  WHERE
      section_id = $1
		`, [sectionId]);

/**
 * Update category
 */
const update = async (categoryInfo:
	UpdateCategoryRequestDTO): Promise<QueryResultRow> => db.query(`
    UPDATE categories
    SET 
      title = $2,
      weight = $3
    WHERE category_id = $1
    RETURNING *
		`, [
	categoryInfo.category_id,
	categoryInfo.title,
	categoryInfo.weight,
]);

/**
 * Remove category
 */
const remove = async (categoryId: number): Promise<QueryResultRow> => db.query(`
  DELETE FROM categories 
  WHERE category_id = $1
  RETURNING *
		`, [categoryId]);

export default {
	create,
	getAllBySection,
	update,
	remove,
};
