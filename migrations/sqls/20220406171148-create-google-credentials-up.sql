CREATE TABLE google_credentials(
	user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  refresh_token TEXT,
  expiry_date BIGINT,
  access_token TEXT,
  token_type TEXT,
  id_token TEXT,
  scope TEXT,
  PRIMARY KEY (user_id)
);
