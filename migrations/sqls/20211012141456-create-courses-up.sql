CREATE TABLE courses(
	course_id SERIAL PRIMARY KEY,
	curriculum_id INT REFERENCES curriculums(curriculum_id) ON DELETE CASCADE,
	pre_course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
	course_name_en VARCHAR(50) NOT NULL,
	course_name_th VARCHAR(50) NOT NULL
);