CREATE TABLE standards(
	standard_id SERIAL PRIMARY KEY,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE curriculums(
  curriculum_id SERIAL PRIMARY KEY,
	main_standard_id INT REFERENCES standards(standard_id) ON DELETE CASCADE,
	relative_standard_id INT REFERENCES standards(standard_id) ON DELETE CASCADE,
	title VARCHAR(50) NOT NULL,
	year VARCHAR(50) NOT NULL
);