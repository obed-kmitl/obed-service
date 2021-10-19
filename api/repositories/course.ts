import db from '_/utils/db';
import { CreateCourseRequestDTO, CourseInputDTO } from '_/dtos/course';
import { QueryResultRow } from 'pg';

/**
 * Create course
 */
const createCourse = async (courseInfo:	 CreateCourseRequestDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO courses (course_id, curriculum_id, pre_course_id, course_name_en, course_name_th) 
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
		`, [
	courseInfo.course_id,
	courseInfo.curriculum_id,
	courseInfo.pre_course_id,
	courseInfo.course_name_en,
	courseInfo.course_name_th,
]);

/**
 * Find course by currriculumId
 */
const findAllByCurriculum = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
 SELECT *
 FROM courses
 WHERE curriculum_id = $1
`, [curriculumId]);

/**
 * Update course info
 */
const updateCourse = async (courseInfo: CourseInputDTO): Promise<QueryResultRow> => db.query(`
 UPDATE courses
 SET pre_course_id = $2,
 		 course_name_en = $3,
		 course_name_th = $4
 WHERE course_id = $1
 RETURNING *
`, [
	courseInfo.course_id,
	courseInfo.pre_course_id,
	courseInfo.course_name_en,
	courseInfo.course_name_th,
]);

/**
* Delete one course
*/
const deleteCourse = async (courseId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM courses 
 WHERE course_id = $1
 RETURNING *
`, [courseId]);

export default {
	createCourse,
	findAllByCurriculum,
	updateCourse,
	deleteCourse,
};
