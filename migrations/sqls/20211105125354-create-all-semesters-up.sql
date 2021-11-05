CREATE TABLE semesters(
	semester_id SERIAL PRIMARY KEY,
	year_number INT NOT NULL,
	semester_number INT NOT NULL
);

CREATE TABLE group_sections(
	group_sec_id SERIAL PRIMARY KEY,
	semester_id INT NOT NULL REFERENCES semesters(semester_id) ON DELETE CASCADE,
	course_id CHAR(8) NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE sections(
	section_id SERIAL PRIMARY KEY,
	group_sec_id INT NOT NULL REFERENCES semesters(semester_id) ON DELETE CASCADE,
	section_number INT NOT NULL,
	course_id CHAR(8) NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE teachers(
	section_id INT REFERENCES semesters(semester_id) ON DELETE CASCADE,
	user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
	PRIMARY KEY (section_id, user_id)
);