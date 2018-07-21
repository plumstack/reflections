CREATE TABLE rs.cohorts (
  id INTEGER PRIMARY KEY,
  cohort_status TEXT 
);

CREATE TABLE rs.employees (
  employee_name TEXT NOT NULL,
  slack_id TEXT NOT NULL PRIMARY KEY,
  cohort_id INTEGER DEFAULT 0,
  UNIQUE (slack_id),
  FOREIGN KEY (cohort_id) REFERENCES rs.cohorts(id)
);

CREATE TABLE rs.reflections (
  id serial PRIMARY KEY,
  reflection_text TEXT 
);

CREATE TABLE rs.meetings (
  id serial PRIMARY KEY,
  meeting_notes TEXT,
  meeting_date DATE,
  reflection_id INTEGER,
  employee_id TEXT,
  respond_by_date DATE,
  meeting_status TEXT DEFAULT 'needs response',
  FOREIGN KEY (reflection_id) REFERENCES rs.reflections(id),
  FOREIGN KEY (employee_id) REFERENCES rs.employees(slack_id)
);

CREATE TABLE rs.response (
  id serial PRIMARY KEY,
  response_text TEXT,
  response_date DATE,
  meeting_id INTEGER,
  FOREIGN KEY (meeting_id) REFERENCES rs.meetings(id)
);

CREATE TABLE rs.tags (
  id serial PRIMARY KEY,
  tag TEXT 
);

CREATE TABLE rs.reflections_tags (
  tag_id INTEGER,
  reflection_id INTEGER,
  FOREIGN KEY (tag_id) REFERENCES rs.tags(id),
  FOREIGN KEY (reflection_id) REFERENCES rs.reflections(id),
  PRIMARY KEY(tag_id, reflection_id)
);
	
INSERT INTO rs.cohorts (id, cohort_status) VALUES (0, 'unassigned');
INSERT INTO rs.cohorts (id, cohort_status) VALUES (1, 'staff');

CREATE TABLE rs.authedUsers(
	id TEXT primary key,
	name text,
	sessionID TEXT,
	accessToken TEXT,
	refreshToken TEXT
);