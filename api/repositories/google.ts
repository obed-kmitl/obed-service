import db from '_/utils/db';
import { QueryResultRow } from 'pg';
import { GoogleCredentialPayloadDTO } from '_/dtos/google';

export const upsert = async (googleCredentialPayload: GoogleCredentialPayloadDTO): Promise<QueryResultRow> => db.query(`
INSERT INTO
    google_credentials(
        user_id,
        refresh_token,
        expiry_date,
        access_token,
        token_type,
        id_token,
        scope
    )
VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id) DO
UPDATE
SET
    refresh_token = $2,
    expiry_date = $3,
    access_token = $4,
    token_type = $5,
    id_token = $6,
    scope = $7
		`, [
	googleCredentialPayload.user_id,
	googleCredentialPayload.refresh_token,
	googleCredentialPayload.expiry_date,
	googleCredentialPayload.access_token,
	googleCredentialPayload.token_type,
	googleCredentialPayload.id_token,
	googleCredentialPayload.scope,
]);

export const getCredentials = async (userId: number): Promise<QueryResultRow> => db.query(`
SELECT
    *
FROM
    google_credentials
WHERE
    user_id = $1
		`, [
	userId,
]);

export const removeByUser = async (userId: number): Promise<QueryResultRow> => db.query(`
DELETE FROM google_credentials 
WHERE user_id = $1
RETURNING *
		`, [
	userId,
]);
