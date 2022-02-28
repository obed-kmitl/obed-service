CREATE TABLE reports(
	report_id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
  grade INT[8],
  prev_improvement VARCHAR(300)[],
  verify_method VARCHAR(300)[],
  summary VARCHAR(300)[],
  unique(section_id)
);

CREATE TABLE next_improvements(
	next_improve_id SERIAL PRIMARY KEY,
  report_id INT NOT NULL REFERENCES reports(report_id) ON DELETE CASCADE,
  title VARCHAR(300),
  cause VARCHAR(300)[],
  work VARCHAR(300)[],
  evaluation VARCHAR(300)[]
);
