import db from '_/utils/db';
import { QueryResultRow } from 'pg';

import format from 'pg-format';
import { UpdateStudentRequestDTO } from '_/dtos/student';

/**
 * Get all students by section
 */
const getAllBySection = async (
	sectionId: number,
): Promise<QueryResultRow> => db.query(`
SELECT
  *
FROM
  students
WHERE
  section_id = $1
`, [sectionId]);

/**
 * Get student
 */
const get = async (
	studentId: number,
): Promise<QueryResultRow> => db.query(`
SELECT
  *
FROM
  students
WHERE
  student_id = $1
`, [studentId]);

/**
 * Create students
 */
const create = async (
	studentArray: any[][],
): Promise<QueryResultRow> => db.query(format(`
INSERT INTO
  students
  (section_id, prefix, student_number, firstname, lastname)
VALUES
  %L
`, studentArray));

/**
 * Remove student
 */
const remove = async (
	studentId: number,
): Promise<QueryResultRow> => db.query(`
DELETE FROM students 
WHERE student_id = $1
RETURNING *
`, [studentId]);

/**
 * Update student
 */
const update = async (studentId: number, studentInfo: UpdateStudentRequestDTO): Promise<QueryResultRow> => db.query(`
 UPDATE students
 SET 
    prefix= $2,
    student_number= $3,
    firstname= $4,
    lastname= $5
 WHERE student_id = $1
 RETURNING *
`, [
	studentId,
	studentInfo.prefix,
	studentInfo.student_number,
	studentInfo.firstname,
	studentInfo.lastname,
]);

export default {
	create,
	getAllBySection,
	get,
	remove,
	update,
};
