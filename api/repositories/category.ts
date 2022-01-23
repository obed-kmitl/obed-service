import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import format from 'pg-format';
import {
	SaveCategoryRequestDTO, CreateCategoryRequestDTO, UpdateCategoryRequestDTO,
} from '_/dtos/category';

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

/**
 * Save Category
 */
const save = async (
	saveCategoryInfo: SaveCategoryRequestDTO,
): Promise<QueryResultRow> => db.transaction(
	async () => {
		const { section_id, categories } = saveCategoryInfo;
		const { rows: oldCategories } = await getAllBySection(section_id);

		let toRemove: number[] = [];
		let toUpdate: UpdateCategoryRequestDTO[] = [];
		let toAdd: any[][] = [];

		for (const cate of categories) {
			const isMatch = oldCategories.find((oldCate) => oldCate.category_id === cate.category_id);

			if (isMatch) {
				const updateCate: UpdateCategoryRequestDTO = {
					category_id: parseInt(cate.category_id.toString(), 10),
					title: cate.title,
					weight: cate.weight,
				};
				toUpdate.push(updateCate);
			}

			if (!isMatch && cate.category_id.toString().includes('NEW_')) {
				toAdd.push([cate.section_id, cate.title, cate.weight]);
			}
		}

		for (const oldCate of oldCategories) {
			const isMatch = categories.find((cate) => oldCate.category_id === cate.category_id);
			if (!isMatch) {
				toRemove.push(oldCate.category_id);
			}
		}

		if (toAdd.length > 0) {
			await db.query(format(`
        INSERT INTO 
          categories
          (section_id, title, weight) 
        VALUES 
          %L
        `, toAdd));
		}

		for (const removeId of toRemove) {
			await remove(removeId);
		}

		for (const updateCate of toUpdate) {
			await update(updateCate);
		}

		return saveCategoryInfo.section_id;
	},
	async (sectionId) => getAllBySection(sectionId),
);

export default {
	save,
	create,
	getAllBySection,
	update,
	remove,
};
