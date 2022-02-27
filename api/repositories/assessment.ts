import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import {
	SaveIndividualAssessmentPayload, CreateGroupRequestDTO,
	AssignGroupRequestDTO, UnassignGroupRequestDTO, UpdateGroupRequestDTO,
} from '_/dtos/assessment';

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

/**
* createGroup
*/
const createGroup = async (groupInfo: CreateGroupRequestDTO, activityId: number): Promise<QueryResultRow> => db.query(`
INSERT INTO groups (title, activity_id)
VALUES ($1, $2)
RETURNING *
   `, [
	groupInfo.title,
	activityId,
]);

/**
* updateGroup
*/
const updateGroup = async (groupInfo: UpdateGroupRequestDTO, groupId: number): Promise<QueryResultRow> => db.query(`
UPDATE groups
SET 
  title = $1
WHERE group_id = $2
RETURNING *
   `, [
	groupInfo.title,
	groupId,
]);

/**
 * assignGroup
 */
const assignGroup = async (assignGroupInfo: AssignGroupRequestDTO, groupId: number): Promise<QueryResultRow> => db.query(`
INSERT INTO
  student_groups
  (group_id, student_id)
VALUES ($1, $2)
RETURNING *
  `, [
	groupId,
	assignGroupInfo.student_id,
]);

/**
 * findAllGroupByActivity
 */
const findAllGroupByActivity = async (activityId: number): Promise<QueryResultRow> => db.query(`
SELECT
    g.group_id,
    g.title,
    COALESCE(
        json_agg(
            json_build_object(
                'student_id',
                sg.student_id,
                'student_number',
                sg.student_number,
                'prefix',
                sg.prefix,
                'firstname',
                sg.firstname,
                'lastname',
                sg.lastname
            )
        ) FILTER (
            WHERE
                sg.student_id IS NOT NULL
        ),
        '[]'
    ) AS students
FROM
    groups g
    LEFT JOIN (
        SELECT
            sgx.student_id AS student_id_x,
            sgx.group_id,
            s.*
        FROM
            student_groups sgx
            LEFT JOIN students s ON s.student_id = sgx.student_id
    ) sg ON sg.group_id = g.group_id
WHERE
    activity_id = $1
GROUP BY
    g.group_id
   `, [
	activityId,
]);

/**
 * findGroup
 */
const findGroup = async (groupId: number): Promise<QueryResultRow> => db.query(`
 SELECT
     g.group_id,
     g.title,
     COALESCE(
         json_agg(
             json_build_object(
                 'student_id',
                 sg.student_id,
                 'student_number',
                 sg.student_number,
                 'prefix',
                 sg.prefix,
                 'firstname',
                 sg.firstname,
                 'lastname',
                 sg.lastname
             )
         ) FILTER (
             WHERE
                 sg.student_id IS NOT NULL
         ),
         '[]'
     ) AS students
 FROM
     groups g
     LEFT JOIN (
         SELECT
             sgx.student_id AS student_id_x,
             sgx.group_id,
             s.*
         FROM
             student_groups sgx
             LEFT JOIN students s ON s.student_id = sgx.student_id
     ) sg ON sg.group_id = g.group_id
 WHERE
     g.group_id = $1
 GROUP BY
     g.group_id
    `, [
	groupId,
]);

/**
 * removeStudentGroup
 */
const removeStudentGroup = async (unassignGroupInfo: UnassignGroupRequestDTO, groupId: number): Promise<QueryResultRow> => db.query(`
DELETE FROM student_groups
WHERE group_id = $1 AND student_id = $2
RETURNING *
   `, [
	groupId,
	unassignGroupInfo.student_id,
]);

/**
 * getAllGroupAssessmentByActivity
 */
const getAllGroupAssessmentByActivity = async (activityId: number): Promise<QueryResultRow> => db.query(`
SELECT
    g.group_id,
    g.title,
    stu.student_id,
    stu.student_number,
    stu.prefix,
    stu.firstname,
    stu.lastname,
    sa.sub_activity_id,
    sa.detail,
    sa.max_score,
    sc.score
FROM
    groups g
    LEFT JOIN student_groups sg ON sg.group_id = g.group_id
    LEFT JOIN students stu ON stu.student_id = sg.student_id
    LEFT JOIN sub_activities sa ON sa.activity_id = $1
    LEFT JOIN scores sc ON sc.sub_activity_id = sa.sub_activity_id
    AND sc.student_id = stu.student_id
WHERE
    g.activity_id = $1
     `, [
	activityId,
]);

/**
* Delete Group
*/
const deleteGroup = async (groupId: string): Promise<QueryResultRow> => db.query(`
 DELETE FROM groups 
 WHERE group_id = $1
 RETURNING *
`, [groupId]);

export default {
	saveIndividual,
	getAllIndividualByActivity,
	createGroup,
	assignGroup,
	findAllGroupByActivity,
	removeStudentGroup,
	findGroup,
	getAllGroupAssessmentByActivity,
	deleteGroup,
	updateGroup,
};
