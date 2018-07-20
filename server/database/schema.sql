CREATE TABLE rs.employees (
  employee_name varchar(50) NOT NULL,
  slack_id varchar(50) NOT NULL PRIMARY KEY,
  cohort_id integer,
  UNIQUE (slack_id),
  FOREIGN KEY (cohort_id) REFERENCES rs.cohorts(id)
);

CREATE TABLE rs.cohorts (
  id integer PRIMARY KEY,
  cohort_status text
);

CREATE TABLE rs.meetings (
  id serial PRIMARY KEY,
  meeting_notes TEXT,
  meeting_date INTEGER,
  reflection_id INTEGER,
  employee_id varchar(50),
  respond_by_date INTEGER,
  meeting_status TEXT,
  FOREIGN KEY (reflection_id) REFERENCES rs.reflections(id),
  FOREIGN KEY (employee_id) REFERENCES rs.employees(slack_id)
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
  FOREIGN KEY (meeting_id) REFERENCES rs.meetings(id)
);

CREATE TABLE rs.tags (
  id serial PRIMARY KEY,
  tag text
);

CREATE TABLE rs.reflections_tags (
  tag_id INTEGER,
  reflection_id INTEGER,
  FOREIGN KEY (tag_id) REFERENCES rs.tags(id),
  FOREIGN KEY (reflection_id) REFERENCES rs.reflections(id),
  PRIMARY KEY(tag_id, reflection_id)
);

CREATE TABLE rs.authedUsers(
	id TEXT primary key,
	name text,
	sessionID TEXT,
	accessToken TEXT,
	refreshToken TEXT
);
	