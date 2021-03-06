CREATE TABLE semesters(
	semester_id SERIAL PRIMARY KEY,
  curriculum_id INT NOT NULL REFERENCES curriculums(curriculum_id) ON DELETE CASCADE,
	year_number INT NOT NULL,
	semester_number INT NOT NULL
);

CREATE TABLE group_sections(
	group_sec_id SERIAL PRIMARY KEY,
	semester_id INT NOT NULL REFERENCES semesters(semester_id) ON DELETE CASCADE,
	course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE sections(
	section_id SERIAL PRIMARY KEY,
	group_sec_id INT NOT NULL REFERENCES group_sections(group_sec_id) ON DELETE CASCADE,
	section_number INT NOT NULL
);

CREATE TABLE teachers(
	section_id INT REFERENCES sections(section_id) ON DELETE CASCADE,
	user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
	PRIMARY KEY (section_id, user_id)
);