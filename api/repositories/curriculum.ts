import db from '_/utils/db';
import { CreateCurriculumRequestDTO, CurriculumInputDTO } from '_/dtos/curriculum';
import { QueryResultRow } from 'pg';
import { plainToInstance } from 'class-transformer';
import { CreateAllStandardsRequestDTO } from '_/dtos/standard';
import { courseRepository, standardRepository } from '.';

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

/**
 * duplicate
 */
const duplicate = async (
	curriculumId: number,
): Promise<QueryResultRow> => db.transaction(async () => {
	const { rows: curriculumRows } = await findCurriculum(curriculumId);
	const { rows: newCurrculumRows } = await createCurriculum({
		title: curriculumRows[0].title,
		university: curriculumRows[0].university,
		department: curriculumRows[0].department,
		faculty: curriculumRows[0].faculty,
	});
	const newCurriculumId: number = newCurrculumRows[0].curriculum_id;

	const { rows: courseRows } = await courseRepository.findAllByCurriculum(curriculumId);
	for (const course of courseRows) {
		await courseRepository.createCourse({
			curriculum_id: newCurriculumId,
			course_number: course.course_number,
			course_name_en: course.course_name_en,
			course_name_th: course.course_name_th,
		});
	}

	const { rows: standardRows } = await standardRepository.findAllByCurriculum(curriculumId);
	const createAllStandardsInfo = plainToInstance(
		CreateAllStandardsRequestDTO,
		{
			curriculum_id: newCurriculumId,
			standards: standardRows,
		},
		{ excludeExtraneousValues: true },
	);
	await standardRepository.createAllStandards(createAllStandardsInfo);

	return { newCurriculumId };
}, async ({ newCurriculumId }) => findCurriculum(newCurriculumId));

export default {
	createCurriculum,
	findCurriculum,
	findAllCurriculum,
	updateCurriculum,
	deleteCurriculum,
	duplicate,
};
