import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import format from 'pg-format';
import {
	SaveReportRequestDTO,
} from '_/dtos/report';
import { toPgArray } from '_/utils/toPostgresArray';

/**
 * Remove next improvments
 */
const removeNextImprovement = async (reportId: number): Promise<QueryResultRow> => db.query(`
 DELETE FROM next_improvements
 WHERE report_id = $1
 RETURNING *
   `, [reportId]);

/**
 * get report by section
 */
const getReportBySection = async (sectionId: number): Promise<QueryResultRow> => db.query(`
SELECT
    rp.*,
    COALESCE(
        json_agg(
            json_build_object(
                'title',
                ni.title,
                'cause',
                ni.cause,
                'work',
                ni.work,
                'evaluation',
                ni.evaluation
            )
        ) FILTER (
            WHERE
                ni.report_id IS NOT NULL
        ),
        '[]'
    ) AS next_improvements
FROM
    reports rp
    LEFT JOIN next_improvements ni ON ni.report_id = rp.report_id
WHERE
    rp.section_id = $1
GROUP BY
    rp.report_id
  `, [sectionId]);

/**
 * Save Report
 */
const save = async (
	saveReportInfo: SaveReportRequestDTO,
): Promise<QueryResultRow> => db.transaction(
	async () => {
		const upsertResult = await db.query(`
    INSERT INTO
        reports (
            section_id,
            grade,
            prev_improvement,
            verify_method,
            summary
        )
    VALUES($1, $2, $3, $4, $5) ON CONFLICT (section_id) DO
    UPDATE
    SET
        grade = $2,
        prev_improvement = $3,
        verify_method = $4,
        summary = $5
        RETURNING *;
		`, [
			saveReportInfo.section_id,
			saveReportInfo.grade,
			saveReportInfo.prev_improvement,
			saveReportInfo.verify_method,
			saveReportInfo.summary,
		]);

		const { report_id: reportId, section_id } = upsertResult.rows[0];

		await removeNextImprovement(reportId);
		if (saveReportInfo.next_improvements.length > 0) {
			const mapNextImprovement = saveReportInfo.next_improvements.map((ni) => [
				reportId,
				ni.title,
				toPgArray(ni.cause),
				toPgArray(ni.work),
				toPgArray(ni.evaluation),
			]);

			await db.query(format(`
		    INSERT INTO
		      next_improvements
		      (report_id, title, cause, work, evaluation)
		    VALUES
		      %L
		    `, mapNextImprovement));
		}
		return section_id;
	},
	async (sectionId: number) => getReportBySection(sectionId),
);

export default {
	save,
	getReportBySection,
};
