CREATE TABLE oauth_google(
	oauth_google_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  g_refresh_token TEXT,
  g_access_token TEXT
);

CREATE TABLE oauth_refresh_token(
	oauth_rtk_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  refresh_token TEXT,
  expired_at TIMESTAMPTZ
);