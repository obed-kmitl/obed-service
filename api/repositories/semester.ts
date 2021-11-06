import db from '_/utils/db';
import { CreateSemesterRequestDTO } from '_/dtos/semester';
import { QueryResultRow } from 'pg';
import format from 'pg-format';

/**
 * Create Semester
 */
const createSemester = async (semesterInfo:	 CreateSemesterRequestDTO): Promise<QueryResultRow> => db.query(`
	INSERT INTO semesters (year_number, semester_number) 
	VALUES 
			($1, 1),
			($1, 2),
			($1, 3)
	RETURNING *
 `, [
	semesterInfo.year_number,
]);

/**
 * Create multiple group sections
 */
const createGroupSections = async (mapGroupSectionInfo:	 Number[][]): Promise<QueryResultRow> => db.query(format(`
	INSERT INTO
		group_sections
		(semester_id,course_id)
	VALUES
		%L
	RETURNING *
`, mapGroupSectionInfo));

export default {
	createSemester,
	createGroupSections,
};
