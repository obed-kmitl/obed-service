CREATE TABLE credential_types(
	title VARCHAR(50) UNIQUE PRIMARY KEY
);

CREATE TABLE credentials(
	credential_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  g_refresh_token TEXT,
  g_access_token TEXT,
  refresh_token TEXT,
  expired_at TIMESTAMPTZ,
  type VARCHAR(50) NOT NULL REFERENCES credential_types(title) ON DELETE CASCADE
);