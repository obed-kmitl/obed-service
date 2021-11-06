CREATE TABLE course_sub_standards(
	course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
	relative_sub_std_id INT REFERENCES sub_standards(sub_std_id) ON DELETE CASCADE,
	curriculum_id INT REFERENCES curriculums(curriculum_id) ON DELETE CASCADE,
	PRIMARY KEY (course_id, relative_sub_std_id)
);
