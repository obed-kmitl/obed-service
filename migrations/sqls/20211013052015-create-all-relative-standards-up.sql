CREATE TABLE group_sub_standards(
	group_sub_std_num SMALLINT PRIMARY KEY,
	standard_id INT UNIQUE NOT NULL REFERENCES standards(standard_id) ON DELETE CASCADE,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE sub_standards(
	sub_std_num SMALLINT PRIMARY KEY,
	standard_id INT UNIQUE NOT NULL REFERENCES standards(standard_id) ON DELETE CASCADE,
	group_sub_std_num SMALLINT UNIQUE NOT NULL REFERENCES group_sub_standards(group_sub_std_num) ON DELETE CASCADE,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE relative_standards(
	course_id INT UNIQUE NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
	sub_std_num SMALLINT UNIQUE NOT NULL REFERENCES group_sub_standards(group_sub_std_num) ON DELETE CASCADE,
	standard_id INT UNIQUE NOT NULL REFERENCES standards(standard_id) ON DELETE CASCADE,
	group_sub_std_num SMALLINT UNIQUE NOT NULL REFERENCES group_sub_standards(group_sub_std_num) ON DELETE CASCADE
);

CREATE TABLE map_sub_standards(
	main_sub_std_num SMALLINT UNIQUE NOT NULL REFERENCES group_sub_standards(group_sub_std_num) ON DELETE CASCADE,
	main_standard_id INT UNIQUE NOT NULL REFERENCES standards(standard_id) ON DELETE CASCADE,
	main_group_sub_std_num SMALLINT UNIQUE NOT NULL REFERENCES group_sub_standards(group_sub_std_num) ON DELETE CASCADE,
	relative_sub_std_num SMALLINT UNIQUE NOT NULL REFERENCES group_sub_standards(group_sub_std_num) ON DELETE CASCADE,
	relative_standard_id INT UNIQUE NOT NULL REFERENCES standards(standard_id) ON DELETE CASCADE,
	relative_group_sub_std_num SMALLINT UNIQUE NOT NULL REFERENCES group_sub_standards(group_sub_std_num) ON DELETE CASCADE
);