CREATE TABLE scores(
	student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  sub_activity_id INT NOT NULL REFERENCES sub_activities(sub_activity_id) ON DELETE CASCADE,
  score FLOAT,
  PRIMARY KEY (student_id, sub_activity_id)
);
