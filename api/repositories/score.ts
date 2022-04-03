import db from '_/utils/db';
import { QueryResultRow } from 'pg';

/**
 * getBySubActivity
 */
const getBySubActivity = async (
	subActivityId: number,
): Promise<QueryResultRow> => db.query(`
SELECT
    sc.score,
    sc.sub_activity_id
FROM
    sub_activities sa
    LEFT JOIN activities act ON act.activity_id = sa.activity_id
    LEFT JOIN categories cate ON cate.category_id = act.category_id
    LEFT JOIN students stu ON stu.section_id = cate.section_id
    LEFT JOIN scores sc ON sc.student_id = stu.student_id
    AND sc.sub_activity_id = sa.sub_activity_id
WHERE
    sa.sub_activity_id = $1
`, [subActivityId]);

/**
 * getBySubActivityAndStudent
 */
const getBySubActivityAndStudent = async (
	subActivityId: number,
	studentId: number,
): Promise<QueryResultRow> => db.query(`
SELECT
    sc.score,
    sc.sub_activity_id
FROM
    sub_activities sa
    LEFT JOIN activities act ON act.activity_id = sa.activity_id
    LEFT JOIN categories cate ON cate.category_id = act.category_id
    LEFT JOIN students stu ON stu.section_id = cate.section_id
    AND stu.student_id = $2
    LEFT JOIN scores sc ON sc.student_id = stu.student_id
    AND sc.sub_activity_id = sa.sub_activity_id
WHERE
    sa.sub_activity_id = $1
`, [subActivityId, studentId]);

export default {
	getBySubActivity,
	getBySubActivityAndStudent,
};
