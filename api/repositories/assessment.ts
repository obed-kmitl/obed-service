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
const getAllIndividualByActivity = async (sectionId: number, activityId: number): Promise<QueryResultRow> => db.query(`
SELECT
    stu.*,
    sa.sub_activity_id,
    sa.detail,
    sa.max_score,
    sc.score
FROM
    students stu
    LEFT JOIN sub_activities sa ON sa.activity_id = $2
    LEFT JOIN scores sc ON sc.sub_activity_id = sa.sub_activity_id
    AND sc.student_id = stu.student_id
WHERE
    section_id = $1
		`, [
	sectionId,
	activityId,
]);

export default {
	saveIndividual,
	getAllIndividualByActivity,
};
