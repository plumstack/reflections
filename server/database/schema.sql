CREATE TABLE rs.employees (
  id serial PRIMARY KEY,
  employee_name varchar(50) NOT NULL,
  slack_id varchar(50) NOT NULL,
  cohort_id integer,
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
);

CREATE TABLE rs.cohorts (
  id integer PRIMARY KEY,
  status text
);

CREATE TABLE rs.meetings (
  id serial PRIMARY KEY,
  meeting_notes TEXT,
  meeting_date INTEGER,
  reflection_id INTEGER,
  employee_id INTEGER,
  FOREIGN KEY (reflection_id) REFERENCES reflections(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE rs.reflections (
  id serial PRIMARY KEY,
  reflection_text text
);

CREATE TABLE rs.response (
  id serial PRIMARY KEY,
  response_text TEXT,
  response_date INTEGER,
  meeting_id INTEGER,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id)
);

CREATE TABLE rs.tags (
  id serial PRIMARY KEY,
  tag text
);

CREATE TABLE rs.reflections_tags (
  tag_id INTEGER,
  reflection_id INTEGER,
  FOREIGN KEY (tag_id) REFERENCES tags(id),
  FOREIGN KEY (reflection_id) REFERENCES reflections(id),
  PRIMARY KEY(tag_id, reflection_id)
);

DROP TABLE rs.authedusers;

CREATE TABLE rs.authedUsers(
	id TEXT primary key,
	name text,
	sessionID TEXT,
	accessToken TEXT,
	refreshToken TEXT
);
	