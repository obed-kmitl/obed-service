

DROP TYPE IF EXISTS prefix_enum;
CREATE TYPE prefix_enum AS ENUM (
	'PROF_DR', 
	'PROF',
	'ASSOC_PROF_DR', 
	'ASSOC_PROF',
	'ASST_PROF_DR',
	'ASST_PROF', 
	'DR',
	'INSTRUCTOR'
);

DROP TYPE IF EXISTS role_enum;
CREATE TYPE role_enum AS ENUM ('ADMIN','TEACHER');

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(60) NOT NULL,
  prefix prefix_enum NOT NULL DEFAULT 'INSTRUCTOR',
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
	g_auth_code VARCHAR(50),
	roles role_enum[] DEFAULT '{"TEACHER"}',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS standards CASCADE;
CREATE TABLE standards(
	standard_id SERIAL PRIMARY KEY,
	title VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS curriculums CASCADE;
CREATE TABLE curriculums(
  curriculum_id SERIAL PRIMARY KEY,
	main_standard_id INT REFERENCES standards(standard_id) ON DELETE CASCADE,
	relative_standard_id INT REFERENCES standards(standard_id) ON DELETE CASCADE,
	title VARCHAR(50) NOT NULL,
	year VARCHAR(50) NOT NULL
);

