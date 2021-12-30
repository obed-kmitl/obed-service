import db from '_/utils/db';
import { QueryResultRow } from 'pg';

/**
 * Find oauth refresh token
 */
const findOAuthRefreshToken = async (refreshToken: String): Promise<QueryResultRow> => db.query(`
  SELECT
    *
  FROM
    oauth_refresh_token
  WHERE
    refresh_token = $1
`, [refreshToken]);

/**
 * Save oauth refresh token
 */
const saveOAuthRefreshToken = async (
	userId:Number,
	refreshToken?: String | null,
	expiredAt?: String | null,
):
 Promise<QueryResultRow> => db.transaction(async () => {
	const findByUser = await db.query(`
    SELECT
      *
    FROM
      oauth_refresh_token
    WHERE
      user_id = $1
  `, [userId]);
	if (findByUser.rows.length > 0) {
		await db.query(`
      UPDATE
        oauth_refresh_token
      SET
        refresh_token = $2,
        expired_at = $3
      WHERE
        user_id = $1
    `, [userId, refreshToken, expiredAt]);
	} else {
		await db.query(`
      INSERT INTO 
        oauth_refresh_token (user_id, refresh_token, expired_at) 
      VALUES 
        ($1, $2, $3)
    `, [userId, refreshToken, expiredAt]);
	}
},
() => db.query(`
  SELECT
    *
  FROM
    oauth_refresh_token
  WHERE
    user_id = $1
`, [userId]));

export default {
	findOAuthRefreshToken,
	saveOAuthRefreshToken,
};
