import db from '_/utils/db';
import { QueryResultRow } from 'pg';

/**
 * getBySubActivity
 */
const getBySubActivity = async (
	sectionId: number,
	subActivityId: number,
): Promise<QueryResultRow> => db.query(`
SELECT
    sc.score
FROM
    sub_activities sa
    LEFT JOIN students stu ON stu.section_id = $1
    LEFT JOIN scores sc ON sc.student_id = stu.student_id
    AND sc.sub_activity_id = sa.sub_activity_id
WHERE
    sa.sub_activity_id = $2
`, [sectionId, subActivityId]);

export default {
	getBySubActivity,
};
