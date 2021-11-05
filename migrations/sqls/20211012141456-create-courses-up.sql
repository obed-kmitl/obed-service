CREATE TABLE courses(
	course_id SERIAL PRIMARY KEY,
	curriculum_id INT NOT NULL REFERENCES curriculums(curriculum_id) ON DELETE CASCADE,
	pre_course_id INT REFERENCES courses(course_id) ON UPDATE CASCADE ON DELETE SET NULL,
	course_number CHAR(8) NOT NULL,
	course_name_en VARCHAR(50) NOT NULL,
	course_name_th VARCHAR(50) NOT NULL
);