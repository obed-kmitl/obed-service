CREATE TABLE map_standards(
	curriculum_id INT UNIQUE NOT NULL REFERENCES curriculums(curriculum_id) ON DELETE CASCADE,
	main_std_id INT REFERENCES standards(standard_id) ON DELETE CASCADE,
	relative_std_id INT REFERENCES standards(standard_id) ON DELETE CASCADE,
	PRIMARY KEY (curriculum_id, main_std_id, relative_std_id)
);

CREATE TABLE map_sub_standards(
	map_sub_std_id SERIAL PRIMARY KEY,
	curriculum_id INT REFERENCES curriculums(curriculum_id) ON DELETE CASCADE NOT NULL,
	main_sub_std_id INT REFERENCES sub_standards(sub_std_id) ON DELETE CASCADE,
	relative_sub_std_id INT REFERENCES sub_standards(sub_std_id) ON DELETE CASCADE
);
