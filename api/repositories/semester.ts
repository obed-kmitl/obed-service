/* eslint-disable no-console */
import db from '_/utils/db';
import { CreateSemesterRequestDTO, SectionInputDTO, DuplicateSemesterRequestDTO } from '_/dtos/semester';
import { QueryResultRow } from 'pg';
import format from 'pg-format';
import curriculum from './curriculum';

/**
 * Create Semester
 */
const createSemester = async (semesterInfo:	 CreateSemesterRequestDTO): Promise<QueryResultRow> => db.query(`
	INSERT INTO semesters (year_number, curriculum_id, semester_number) 
	VALUES 
			($1, $2, 1),
			($1, $2, 2),
			($1, $2, 3)
	RETURNING *
 `, [
	semesterInfo.year_number,
	semesterInfo.curriculum_id,
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

const findSectionBySectionId = (sectionId: Number): Promise<QueryResultRow> => db.query(`
	SELECT
			s.*,
			COALESCE(
					json_agg(
						json_build_object(
							'user_id',t.user_id,
							'email',t.email,
							'username',t.username,
							'firstname',t.firstname,
							'lastname',t.lastname,
							'prefix',t.prefix,
							'role',t.role
						)
					) FILTER (
							WHERE
									t.teacher_id IS NOT NULL
					),
					'[]'
			) as teacher_list
	FROM
			sections s
			LEFT JOIN (
					SELECT
							tx.user_id as teacher_id,
							tx.section_id,
							ux.*
					FROM
							teachers tx
							LEFT JOIN users ux ON ux.user_id = tx.user_id
			) t ON t.section_id = s.section_id
	WHERE
			s.section_id = $1
	GROUP BY
			s.section_id
`, [sectionId]);

const findByCurriculum = (curriculumId: Number): Promise<QueryResultRow> => db.query(`
SELECT
    sem.*,
    COALESCE(
        json_agg(gss.*) FILTER (
            WHERE
                gss.group_sec_id IS NOT NULL
        ),
        '[]'
    ) AS group_sections
FROM
    semesters sem
    LEFT JOIN (
        SELECT
            gs.*,
            course.curriculum_id,
            course.pre_course_id,
            course.course_number,
            course.course_name_en,
            course.course_name_th,
            COALESCE(
                json_agg(
                    json_build_object(
                        'section_id',
                        ss.section_id,
                        'section_number',
                        ss.section_number,
                        'teacher_list',
                        ss.teacher_list
                    )
                ) FILTER (
                    WHERE
                        ss.section_id IS NOT NULL
                ),
                '[]'
            ) AS sections
        FROM
            group_sections gs
            LEFT JOIN courses course ON course.course_id = gs.course_id
            LEFT JOIN (
                SELECT
                    s.*,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'user_id',
                                t.user_id,
                                'email',
                                t.email,
                                'username',
                                t.username,
                                'firstname',
                                t.firstname,
                                'lastname',
                                t.lastname,
                                'prefix',
                                t.prefix,
                                'role',
                                t.role
                            )
                        ) FILTER (
                            WHERE
                                t.teacher_id IS NOT NULL
                        ),
                        '[]'
                    ) as teacher_list
                FROM
                    sections s
                    LEFT JOIN (
                        SELECT
                            tx.user_id as teacher_id,
                            tx.section_id,
                            ux.*
                        FROM
                            teachers tx
                            LEFT JOIN users ux ON ux.user_id = tx.user_id
                    ) t ON t.section_id = s.section_id
                GROUP BY
                    s.section_id
            ) ss ON ss.group_sec_id = gs.group_sec_id
        GROUP BY
            gs.group_sec_id,
            course.course_id
    ) gss ON gss.semester_id = sem.semester_id
WHERE
    sem.curriculum_id = $1
GROUP BY
    sem.curriculum_id,
    sem.semester_id
`, [curriculumId]);

const findByYear = (yearNumber: Number, curriculumId: Number): Promise<QueryResultRow> => db.query(`
SELECT
    sem.*,
    COALESCE(
        json_agg(gss.*) FILTER (
            WHERE
                gss.group_sec_id IS NOT NULL
        ),
        '[]'
    ) AS group_sections
FROM
    semesters sem
    LEFT JOIN (
        SELECT
            gs.*,
            course.curriculum_id,
            course.pre_course_id,
            course.course_number,
            course.course_name_en,
            course.course_name_th,
            COALESCE(
                json_agg(
                    json_build_object(
                        'section_id',
                        ss.section_id,
                        'section_number',
                        ss.section_number,
                        'teacher_list',
                        ss.teacher_list
                    )
                ) FILTER (
                    WHERE
                        ss.section_id IS NOT NULL
                ),
                '[]'
            ) AS sections
        FROM
            group_sections gs
            LEFT JOIN courses course ON course.course_id = gs.course_id
            LEFT JOIN (
                SELECT
                    s.*,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'user_id',
                                t.user_id,
                                'email',
                                t.email,
                                'username',
                                t.username,
                                'firstname',
                                t.firstname,
                                'lastname',
                                t.lastname,
                                'prefix',
                                t.prefix,
                                'role',
                                t.role
                            )
                        ) FILTER (
                            WHERE
                                t.teacher_id IS NOT NULL
                        ),
                        '[]'
                    ) as teacher_list
                FROM
                    sections s
                    LEFT JOIN (
                        SELECT
                            tx.user_id as teacher_id,
                            tx.section_id,
                            ux.*
                        FROM
                            teachers tx
                            LEFT JOIN users ux ON ux.user_id = tx.user_id
                    ) t ON t.section_id = s.section_id
                GROUP BY
                    s.section_id
            ) ss ON ss.group_sec_id = gs.group_sec_id
        GROUP BY
            gs.group_sec_id,
            course.course_id
    ) gss ON gss.semester_id = sem.semester_id
WHERE
    sem.year_number = $1
    AND
    sem.curriculum_id = $2
GROUP BY
    sem.year_number,
    sem.curriculum_id,
    sem.semester_id
`, [yearNumber, curriculumId]);

const findSectionByTeacher = (teacherId: Number): Promise<QueryResultRow> => db.query(`
SELECT
    COALESCE(
        json_agg(s.*) FILTER (
            WHERE
                s.section_id IS NOT NULL
        ),
        '[]'
    ) AS sections
FROM
    teachers t
    LEFT JOIN (
        SELECT
            sx.*,
            gs.semester_id,
            gs.course_name_en,
            gs.course_name_th,
            gs.course_number,
            gs.department,
            gs.faculty,
            gs.title,
            gs.university,
            gs.semester_number,
            gs.year_number
        FROM
            sections sx
            LEFT JOIN (
                SELECT
                    gsx.*,
                    c.course_name_en,
                    c.course_name_th,
                    c.course_number,
                    c.department,
                    c.faculty,
                    c.title,
                    c.university,
                    sem.semester_number,
                    sem.year_number
                FROM
                    group_sections gsx
                    LEFT JOIN (
                        SELECT
                            cx.*,
                            cur.department,
                            cur.faculty,
                            cur.title,
                            cur.university
                        FROM
                            courses cx
                            LEFT JOIN curriculums cur ON cur.curriculum_id = cx.curriculum_id
                    ) c ON c.course_id = gsx.course_id
                    LEFT JOIN semesters sem ON sem.semester_id = gsx.semester_id
            ) gs ON gs.group_sec_id = sx.group_sec_id
    ) s ON s.section_id = t.section_id
WHERE
    t.user_id = $1
GROUP BY
    t.user_id
`, [teacherId]);

const findSection = (sectionId: Number): Promise<QueryResultRow> => db.query(`
SELECT
    sx.*,
    gs.semester_id,
    gs.course_name_en,
    gs.course_name_th,
    gs.course_number,
    gs.department,
    gs.faculty,
    gs.title,
    gs.university,
    gs.semester_number,
    gs.year_number
FROM
    sections sx
    LEFT JOIN (
        SELECT
            gsx.*,
            c.course_name_en,
            c.course_name_th,
            c.course_number,
            c.department,
            c.faculty,
            c.title,
            c.university,
            sem.semester_number,
            sem.year_number
        FROM
            group_sections gsx
            LEFT JOIN (
                SELECT
                    cx.*,
                    cur.department,
                    cur.faculty,
                    cur.title,
                    cur.university
                FROM
                    courses cx
                    LEFT JOIN curriculums cur ON cur.curriculum_id = cx.curriculum_id
            ) c ON c.course_id = gsx.course_id
            LEFT JOIN semesters sem ON sem.semester_id = gsx.semester_id
    ) gs ON gs.group_sec_id = sx.group_sec_id
WHERE
    sx.section_id = $1
`, [sectionId]);

/**
 * Create section
 */
const createSection = async (groupSecId: Number, sectionInput: SectionInputDTO): Promise<QueryResultRow> => db.query(`
 INSERT INTO
	 sections
	 (group_sec_id, section_number)
 VALUES
	 ($1, $2)
 RETURNING *
`, [groupSecId, sectionInput.section_number]);

/**
 * Create multiple teacherss
 */
const saveTeachers = async (
	sectionId: Number, mapTeacherInfo:	 Number[][],
): Promise<QueryResultRow> => db.transaction(async () => {
	await db.query(`
			DELETE FROM
				teachers
			WHERE
				section_id = $1
		`, [sectionId]);
	if (mapTeacherInfo.length > 0) {
		await db.query(format(`
		INSERT INTO
			teachers
			(section_id, user_id)
		VALUES
			%L
		RETURNING *
		`, mapTeacherInfo));
	}
}, () => findSectionBySectionId(sectionId));

/**
 * Find by semester_id
 */
const find = async (semesterId: number): Promise<QueryResultRow> => db.query(`
	SELECT
			sem.*,
			COALESCE(
					json_agg(gss.*) FILTER (
							WHERE
									gss.group_sec_id IS NOT NULL
					),
					'[]'
			) AS group_sections
	FROM
			semesters sem
			LEFT JOIN (
					SELECT
							gs.*,
							course.curriculum_id,
							course.pre_course_id,
							course.course_number,
							course.course_name_en,
							course.course_name_th,
							COALESCE(
									json_agg(
											json_build_object(
													'section_id',
													ss.section_id,
													'section_number',
													ss.section_number,
													'teacher_list',
													ss.teacher_list
											)
									) FILTER (
											WHERE
													ss.section_id IS NOT NULL
									),
									'[]'
							) AS sections
					FROM
							group_sections gs
							LEFT JOIN courses course ON course.course_id = gs.course_id
							LEFT JOIN (
									SELECT
											s.*,
											COALESCE(
													json_agg(
															json_build_object(
																	'user_id',
																	t.user_id,
																	'email',
																	t.email,
																	'username',
																	t.username,
																	'firstname',
																	t.firstname,
																	'lastname',
																	t.lastname,
																	'prefix',
																	t.prefix,
																	'role',
																	t.role
															)
													) FILTER (
															WHERE
																	t.teacher_id IS NOT NULL
													),
													'[]'
											) as teacher_list
									FROM
											sections s
											LEFT JOIN (
													SELECT
															tx.user_id as teacher_id,
															tx.section_id,
															ux.*
													FROM
															teachers tx
															LEFT JOIN users ux ON ux.user_id = tx.user_id
											) t ON t.section_id = s.section_id
									GROUP BY
											s.section_id
							) ss ON ss.group_sec_id = gs.group_sec_id
					GROUP BY
							gs.group_sec_id,
							course.course_id
			) gss ON gss.semester_id = sem.semester_id
	WHERE
			sem.semester_id = $1
	GROUP BY
			sem.semester_id
`, [semesterId]);

/**
 * Update section
 */
const updateSection = async (sectionId: Number, sectionInput: SectionInputDTO): Promise<QueryResultRow> => db.query(`
 	UPDATE
	 	sections
	SET
		section_number = COALESCE($2, section_number)
	WHERE
		section_id = $1
`, [sectionId, sectionInput.section_number]);

/**
* Delete group section
*/
const deleteGroupSection = async (groupSecId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM group_sections
 WHERE group_sec_id = $1
 RETURNING *
`, [groupSecId]);

/**
* Delete section
*/
const deleteSection = async (sectionId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM sections
 WHERE section_id = $1
 RETURNING *
`, [sectionId]);

/**
 * Duplicate Semester
 */
const duplicateSemester = async (curriculumId: number): Promise<QueryResultRow> => db.transaction(
	async () => {
		const findResult = await findByCurriculum(curriculumId);
		const getAllYearNumber = [...findResult.rows].map((sem) => sem.year_number);
		const lastestYearNumber = Math.max(...getAllYearNumber);
		const newYearNumber = lastestYearNumber + 1;
		const filterLatestYearSemester = [...findResult.rows].filter((
			sem,
		) => sem.year_number === lastestYearNumber);

		const createResult = await createSemester({
			year_number: newYearNumber,
			curriculum_id: curriculumId,
		});

		const mapGroupSectionInfo = createResult.rows.map((
			sem, index,
		) => ({
			semester_id: sem.semester_id,
			group_sections: filterLatestYearSemester[index].group_sections,
		}));

		// eslint-disable-next-line no-restricted-syntax
		for (const sem of mapGroupSectionInfo) {
			// eslint-disable-next-line no-restricted-syntax
			for (const gs of sem.group_sections) {
				const createGroupSectionResult = await createGroupSections([[
					sem.semester_id,
					gs.course_id,
				]]);

				// eslint-disable-next-line no-restricted-syntax
				for (const s of gs.sections) {
					const createSectionResult = await createSection(
						createGroupSectionResult.rows[0].group_sec_id,
						{
							section_number: s.section_number,
						},
					);

					const teacherDataList = s.teacher_list.map((t) => [
						createSectionResult.rows[0].section_id,
						t.user_id,
					]);

					await saveTeachers(
						createSectionResult.rows[0].section_id,
						[...teacherDataList],
					);
				}
			}
		}

		return {
			lastestYearNumber,
			curriculumId,
		};
	},
	(res) => findByYear(res.lastestYearNumber, res.curriculumId),
);

export default {
	createSemester,
	duplicateSemester,
	createGroupSections,
	createSection,
	saveTeachers,
	find,
	findByCurriculum,
	findSectionByTeacher,
	findSection,
	updateSection,
	deleteGroupSection,
	deleteSection,
};
