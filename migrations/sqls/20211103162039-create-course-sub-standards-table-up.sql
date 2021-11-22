CREATE TABLE course_sub_standards(
	course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
	map_sub_std_id INT REFERENCES map_sub_standards(map_sub_std_id) ON DELETE CASCADE,
	PRIMARY KEY (course_id, map_sub_std_id)
);
