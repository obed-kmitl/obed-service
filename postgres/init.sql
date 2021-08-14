DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TYPE IF EXISTS prefix_enum;
DROP TYPE IF EXISTS role_enum;

CREATE TYPE prefix_enum AS ENUM ('Professor','Assistant');
CREATE TYPE role_enum AS ENUM ('Admin','Teacher');
CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  prefix prefix_enum,
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
	g_auth_code VARCHAR(50),
	verified BOOLEAN DEFAULT FALSE,
	role role_enum,
	created_date TIMESTAMP
);

CREATE TABLE teachers(
	section_id SERIAL PRIMARY KEY,
	teacher_id INT,
  CONSTRAINT fk_user
   FOREIGN KEY(teacher_id) 
      REFERENCES users(user_id)
			ON DELETE CASCADE
);

INSERT INTO users (
  email,
  username,
  password,
  prefix,
	firstname,
	lastname,
	role
	) VALUES (
	'teacher@teacher.com', 
	'teacher',
	'password',
	'Professor',
	'TeacherTestFN',
	'TeacherTestLN',
	'Teacher'
);

INSERT INTO teachers(teacher_id) VALUES (1);