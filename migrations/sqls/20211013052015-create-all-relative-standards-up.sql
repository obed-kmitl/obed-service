CREATE TABLE standards(
	standard_id SERIAL PRIMARY KEY,
	curriculum_id INT REFERENCES curriculums(curriculum_id) ON DELETE CASCADE NOT NULL,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE group_sub_standards(
	group_sub_std_id SERIAL PRIMARY KEY,
	standard_id INT REFERENCES standards(standard_id) ON DELETE CASCADE,
	order_number SMALLINT NOT NULL,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE sub_standards(
	sub_std_id SERIAL PRIMARY KEY,
	group_sub_std_id INT REFERENCES group_sub_standards(group_sub_std_id) ON DELETE CASCADE,
	order_number SMALLINT NOT NULL,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE relative_standards(
	course_id CHAR(8) REFERENCES courses(course_id) ON DELETE CASCADE,
	sub_std_id SMALLINT REFERENCES group_sub_standards(group_sub_std_id) ON DELETE CASCADE
);