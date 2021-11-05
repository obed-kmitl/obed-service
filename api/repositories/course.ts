import db from '_/utils/db';
import { CreateCourseInputDTO, CourseInputDTO } from '_/dtos/course';
import { QueryResultRow } from 'pg';
import format from 'pg-format';
import course from '_/controllers/course';

const findByCoursAndCurriculum = async (courseId: Number): Promise<QueryResultRow> => db.query(`
SELECT
		c.*,
		COALESCE(
				json_agg(
				json_build_object(
				'sub_std_id', css.relative_sub_std_id,
				'sub_order_number', css.sub_order_number,
				'sub_title', css.sub_title,
				'group_sub_std_id', css.group_sub_std_id,
				'group_sub_order_number', css.group_sub_order_number,
				'group_sub_title', css.group_sub_title
				)
				) FILTER (
						WHERE
								css.course_id IS NOT NULL
								AND css.curriculum_id IS NOT NULL
								AND css.relative_sub_std_id IS NOT NULL
				),
				'[]'
		) AS relative_standards
FROM
		courses c
		LEFT JOIN (
				SELECT
						cssx.*,
						s_std.order_number as sub_order_number,
						s_std.title as sub_title,
						s_std.group_sub_std_id,
						s_std.group_sub_order_number,
						group_sub_title
				FROM
						course_sub_standards cssx
						LEFT JOIN (
								SELECT
										s_stdx.*,
										gs_std.group_sub_std_id as gss_id,
										gs_std.order_number as group_sub_order_number,
										gs_std.title as group_sub_title
								FROM
										sub_standards s_stdx
										LEFT JOIN group_sub_standards gs_std ON s_stdx.group_sub_std_id = gs_std.group_sub_std_id
						) s_std ON cssx.relative_sub_std_id = s_std.sub_std_id
		) css ON css.course_id = $1
WHERE
		c.course_id = $1
GROUP BY
		c.course_id
`, [courseId]);

/**
 * Create course
 */
const createCourse = async (courseInfo:
	CreateCourseInputDTO): Promise<QueryResultRow> => db.query(`
		INSERT INTO courses ( curriculum_id, pre_course_id, course_number, course_name_en, course_name_th) 
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
				(course_id, relative_sub_std_id, curriculum_id)
			VALUES
				%L
			`, relativeStandardInfo));
	}
}, () => findByCoursAndCurriculum(courseId));

/**
 * Find course by currriculumId
 */
const findAllByCurriculum = async (curriculumId: number): Promise<QueryResultRow> => db.query(`
  SELECT
			c.*,
			COALESCE(
					json_agg(
					json_build_object(
					'sub_std_id', css.relative_sub_std_id,
					'sub_order_number', css.sub_order_number,
					'sub_title', css.sub_title,
					'group_sub_std_id', css.group_sub_std_id,
					'group_sub_order_number', css.group_sub_order_number,
					'group_sub_title', css.group_sub_title
					)
					) FILTER (
							WHERE
									css.course_id IS NOT NULL
									AND css.curriculum_id IS NOT NULL
									AND css.relative_sub_std_id IS NOT NULL
					),
					'[]'
			) AS relative_standards
	FROM
			courses c
			LEFT JOIN (
					SELECT
							cssx.*,
							s_std.order_number as sub_order_number,
							s_std.title as sub_title,
							s_std.group_sub_std_id,
							s_std.group_sub_order_number,
							group_sub_title
					FROM
							course_sub_standards cssx
							LEFT JOIN (
									SELECT
											s_stdx.*,
											gs_std.group_sub_std_id as gss_id,
											gs_std.order_number as group_sub_order_number,
											gs_std.title as group_sub_title
									FROM
											sub_standards s_stdx
											LEFT JOIN group_sub_standards gs_std ON s_stdx.group_sub_std_id = gs_std.group_sub_std_id
							) s_std ON cssx.relative_sub_std_id = s_std.sub_std_id
			) css ON css.course_id = c.course_id
	WHERE
			c.curriculum_id = $1
	GROUP BY
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
};
