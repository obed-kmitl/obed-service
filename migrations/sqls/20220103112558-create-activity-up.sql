CREATE TABLE categories(
	category_id SERIAL PRIMARY KEY,
	section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
  title VARCHAR(50),
  weight FLOAT
);

CREATE TABLE activitie_types(
  title VARCHAR(50) UNIQUE PRIMARY KEY
);

INSERT INTO activitie_types (title)
VALUES
    ('INDIVIDUAL'),
		('GROUP');

CREATE TABLE activities(
	activity_id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
	category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
  title VARCHAR(50),
  detail VARCHAR(400),
  type VARCHAR(50) REFERENCES activitie_types(title) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE sub_activities(
	sub_activity_id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
  title VARCHAR(50),
  detail VARCHAR(400),
  max_score FLOAT
);

