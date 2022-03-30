import db from '_/utils/db';
import { CreateCourseInputDTO, CourseInputDTO } from '_/dtos/course';
import { QueryResultRow } from 'pg';
import format from 'pg-format';

const findByCourse = async (courseId: Number): Promise<QueryResultRow> => db.query(`
	SELECT
			c.*,
			COALESCE(
					json_agg(
							json_build_object(
									'sub_std_id',
									css.sub_std_id,
									'sub_order_number',
									css.sub_order_number,
									'sub_title',
									css.sub_title,
									'group_sub_std_id',
									css.group_sub_std_id,
									'group_sub_order_number',
									css.group_sub_order_number,
									'group_sub_title',
									css.group_sub_title
							)
					) FILTER (
							WHERE
									css.sub_std_id IS NOT NULL
					),
					'[]'
			) AS relative_standards
	FROM
			courses c
			LEFT JOIN (
					SELECT
							cssx.course_id,
							ms_std.sub_std_id,
							ms_std.sub_order_number,
							ms_std.sub_title,
							ms_std.group_sub_std_id,
							ms_std.group_sub_order_number,
							ms_std.group_sub_title
					FROM
							course_sub_standards cssx
							LEFT JOIN (
									SELECT
											ms_stdx.*,
											ss.*
									FROM
											map_sub_standards ms_stdx
											LEFT JOIN (
													SELECT
															ssx.sub_std_id,
															ssx.order_number AS sub_order_number,
															ssx.title AS sub_title,
															gss.group_sub_std_id,
															gss.order_number AS group_sub_order_number,
															gss.title AS group_sub_title
													FROM
															sub_standards ssx
															LEFT JOIN group_sub_standards gss ON gss.group_sub_std_id = ssx.group_sub_std_id
											) ss ON ss.sub_std_id = ms_stdx.relative_sub_std_id
							) ms_std ON cssx.map_sub_std_id = ms_std.map_sub_std_id
					GROUP BY
							cssx.course_id,
							ms_std.sub_std_id,
							ms_std.sub_order_number,
							ms_std.sub_title,
							ms_std.group_sub_std_id,
							ms_std.group_sub_order_number,
							ms_std.group_sub_title
			) AS css ON css.course_id = c.course_id
	WHERE
			c.course_id = $1
	GROUP BY
			c.course_id
`, [courseId]);

/**
 * findByCurriculumAndCourse
 */
const findByCurriculumAndCourse = async (curriculumId, courseId): Promise<QueryResultRow> => db.query(`
		SELECT
        *
    FROM
        courses
    WHERE
        curriculum_id = $1
        AND course_number = $2
		`, [
	curriculumId, courseId,
]);

/**
 * Create course
 */
const createCourse = async (courseInfo:
	CreateCourseInputDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO courses (curriculum_id, pre_course_id, course_number, course_name_en, course_name_th) 
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
		`, [
	courseInfo.curriculum_id,
	courseInfo.pre_course_id,
	courseInfo.course_number,
	courseInfo.course_name_en,
	courseInfo.course_name_th,
]);

/**
 * Create multiple course sub standards
 */
const createCourseSubStandards = async (
	courseId: Number,	relativeStandardInfo: Number[][],
): Promise<QueryResultRow> => db.transaction(async () => {
	await db.query(`
			DELETE FROM
				course_sub_standards
			WHERE
				course_id = $1
		`, [courseId]);
	if (relativeStandardInfo.length > 0) {
		await db.query(format(`
			INSERT INTO
				course_sub_standards
				(course_id, map_sub_std_id)
			VALUES
				%L
			`, relativeStandardInfo));
	}
}, () => findByCourse(courseId));

/**
 * Find course by currriculumId
 */
const findAllByCurriculum = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
SELECT
    c.*,
    COALESCE(
        json_agg(
            json_build_object(
                'sub_std_id',
                css.sub_std_id,
                'sub_order_number',
                css.sub_order_number,
                'sub_title',
                css.sub_title,
                'group_sub_std_id',
                css.group_sub_std_id,
                'group_sub_order_number',
                css.group_sub_order_number,
                'group_sub_title',
                css.group_sub_title
            )
        ) FILTER (
            WHERE
                css.sub_std_id IS NOT NULL
        ),
        '[]'
    ) AS relative_standards
FROM
    courses c
    LEFT JOIN (
        SELECT
            cssx.course_id,
            ms_std.sub_std_id,
            ms_std.sub_order_number,
            ms_std.sub_title,
            ms_std.group_sub_std_id,
            ms_std.group_sub_order_number,
            ms_std.group_sub_title
        FROM
            course_sub_standards cssx
            LEFT JOIN (
                SELECT
                    ms_stdx.*,
                    ss.*
                FROM
                    map_sub_standards ms_stdx
                    LEFT JOIN (
                        SELECT
                            ssx.sub_std_id,
                            ssx.order_number AS sub_order_number,
                            ssx.title AS sub_title,
                            gss.group_sub_std_id,
                            gss.order_number AS group_sub_order_number,
                            gss.title AS group_sub_title
                        FROM
                            sub_standards ssx
                            LEFT JOIN group_sub_standards gss ON gss.group_sub_std_id = ssx.group_sub_std_id
                    ) ss ON ss.sub_std_id = ms_stdx.relative_sub_std_id
            ) ms_std ON cssx.map_sub_std_id = ms_std.map_sub_std_id
        GROUP BY
            cssx.course_id,
            ms_std.sub_std_id,
            ms_std.sub_order_number,
            ms_std.sub_title,
            ms_std.group_sub_std_id,
            ms_std.group_sub_order_number,
            ms_std.group_sub_title
    ) AS css ON css.course_id = c.course_id
WHERE
    c.curriculum_id = $1
GROUP BY
    c.curriculum_id,
    c.course_id
`, [curriculumId]);

/**
 * Update course info
 */
const updateCourse = async (
	courseInfo: CourseInputDTO, courseId: Number,
): Promise<QueryResultRow> => db.query(`
		UPDATE courses
		SET 
				pre_course_id = CASE WHEN $2::INT = -1 THEN NULL ELSE COALESCE($2, pre_course_id) END,
				course_number = COALESCE($3::CHAR(8), course_number),
				course_name_en = COALESCE($4, course_name_en),
				course_name_th = COALESCE($5, course_name_th)
		WHERE course_id = $1
		RETURNING *
 `, [
	courseId,
	courseInfo.pre_course_id,
	courseInfo.course_number,
	courseInfo.course_name_en,
	courseInfo.course_name_th,
]);

/**
* Delete one course
*/
const deleteCourse = async (courseId: string): Promise<QueryResultRow> => db.query(`
 DELETE FROM courses 
 WHERE course_id = $1
 RETURNING *
`, [courseId]);

export default {
	createCourse,
	createCourseSubStandards,
	findAllByCurriculum,
	updateCourse,
	deleteCourse,
	findByCurriculumAndCourse,
};
