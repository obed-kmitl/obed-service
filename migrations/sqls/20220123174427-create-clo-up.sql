CREATE TABLE clos(
	clo_id SERIAL PRIMARY KEY,
	section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
  detail VARCHAR(300),
  order_number VARCHAR(300)
);

CREATE TABLE clo_sub_standards(
	clo_id INT NOT NULL REFERENCES clos(clo_id) ON DELETE CASCADE,
	map_sub_std_id INT REFERENCES map_sub_standards(map_sub_std_id) ON DELETE CASCADE,
  PRIMARY KEY (clo_id, map_sub_std_id)
);

CREATE TABLE sub_activities_clo(
  sub_activity_id INT NOT NULL REFERENCES sub_activities(sub_activity_id) ON DELETE CASCADE,
  clo_id INT NOT NULL REFERENCES clos(clo_id) ON DELETE CASCADE,
  PRIMARY KEY (sub_activity_id, clo_id)
);