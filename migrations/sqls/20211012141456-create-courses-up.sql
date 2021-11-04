CREATE TABLE courses(
	course_id CHAR(8) PRIMARY KEY,
	curriculum_id INT UNIQUE NOT NULL REFERENCES curriculums(curriculum_id) ON DELETE CASCADE,
	pre_course_id CHAR(8) REFERENCES courses(course_id) ON UPDATE CASCADE ON DELETE SET NULL,
	course_name_en VARCHAR(50) NOT NULL,
	course_name_th VARCHAR(50) NOT NULL
);