CREATE TABLE groups(
	group_id SERIAL PRIMARY KEY,
  title VARCHAR(300)
);

CREATE TABLE students(
  student_id SERIAL PRIMARY KEY,
	section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
  prefix VARCHAR(300),
  student_number VARCHAR(8),
  firstname VARCHAR(300),
  lastname VARCHAR(300)
);

CREATE TABLE student_groups(
  group_id INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, student_id)
);