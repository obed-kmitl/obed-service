CREATE TABLE semesters(
	semester_id SERIAL PRIMARY KEY,
	year_number INT,
	semester_number INT
);

CREATE TABLE group_sections(
	group_sec_id SERIAL PRIMARY KEY,
	semester_id INT REFERENCES semesters(semester_id) ON DELETE CASCADE,
	course_id CHAR(8) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE sections(
	section_id SERIAL PRIMARY KEY,
	group_sec_id INT REFERENCES semesters(semester_id) ON DELETE CASCADE,
	section_number INT,
	course_id CHAR(8) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE teachers(
	section_id INT REFERENCES semesters(semester_id) ON DELETE CASCADE,
	user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
	PRIMARY KEY (section_id, user_id)
);