import db from '_/utils/db';
import { CreateSemesterRequestDTO } from '_/dtos/semester';
import { QueryResultRow } from 'pg';

/**
 * Create Semester
 */
const createSemester = async (semesterInfo:	 CreateSemesterRequestDTO): Promise<QueryResultRow> => db.query(`
 INSERT INTO semesters (title, university, department, faculty) 
 VALUES ($1, $2, $3, $4)
 RETURNING *
 `, [
	// semesterInfo.title,
	// semesterInfo.university,
	// semesterInfo.department,
	// semesterInfo.faculty,
]);

export default {
	createSemester,
};
