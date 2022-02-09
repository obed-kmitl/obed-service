import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import format from 'pg-format';
import { SaveIndividualAssessmentPayload } from '_/dtos/assessment';

/**
 * Create assessment
 */
const saveIndividual = async (individualAssessmentPayload:
	SaveIndividualAssessmentPayload): Promise<QueryResultRow> => db.query(`
  INSERT INTO scores (student_id, sub_activity_id, score)
  VALUES($1,$2,$3) 
  ON CONFLICT (student_id, sub_activity_id) 
  DO 
     UPDATE SET score = $3
		`, [
	individualAssessmentPayload.student_id,
	individualAssessmentPayload.sub_activity_id,
	individualAssessmentPayload.score,
]);

/**
 * getAllIndividualByActivity
 */
const getAllIndividualByActivity = async (activityId: number): Promise<QueryResultRow> => db.query(`
SELECT
    sa.sub_activity_id,
    sa.detail,
    sa.max_score,
    s.student_id,
    s.student_number,
    s.prefix,
    s.firstname,
    s.lastname,
    sc.score
FROM
    sub_activities sa
    LEFT JOIN activities a ON a.activity_id = $1
    LEFT JOIN students s ON s.section_id = a.section_id
    LEFT JOIN scores sc ON sc.sub_activity_id = sa.sub_activity_id
WHERE
    sa.activity_id = $1
    AND sc.student_id = s.student_id
		`, [
	activityId,
]);

export default {
	saveIndividual,
	getAllIndividualByActivity,
};
