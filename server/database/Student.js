class Student {
  constructor(client) {
    this.client = client;
  }

  async getStudents() {
    const SQL = 'SELECT * FROM rs.students;';
    try {
      const currentStudents = await this.client.query(SQL);
      return currentStudents.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOverdueStudents() {
    const SQL = `
              SELECT s.slack_id, m.respond_by_date
              FROM rs.students AS s
              LEFT JOIN rs.meetings AS m
                ON (s.newest_meeting_id = m.id)
                WHERE now()::DATE >= m.respond_by_date::DATE AND
                s.status = 'needs response';`;
    try {
      const overdueStudents = await this.client.query(SQL);
      return overdueStudents.rows.map((student) => student.slack_id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUnassignedStudents() {
    const SQL = 'SELECT * FROM rs.students WHERE cohort_id = 0;';
    try {
      const unassignedStudents = await this.client.query(SQL);
      return unassignedStudents.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateStudentCohort({ slackID, cohortID }) {
    const SQL = 'UPDATE rs.students SET cohort_id = $1 where slack_id = $2;';
    try {
      await this.client.query(SQL, [cohortID, slackID]);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getStudentMeetings({ slackID }) {
    const SQL = `SELECT m.id, m.meeting_notes, m.meeting_date,
                m.meeting_status, m.respond_by_date, r.reflection_text,
                re.response_text, re.response_date
                FROM rs.meetings AS m 
                LEFT JOIN rs.reflections AS r 
                  ON (m.reflection_id = r.id)
                LEFT JOIN rs.response AS re
                  ON (re.meeting_id = m.id)
                WHERE m.student_id = $1;`;
    const studentInfo = 'SELECT * FROM rs.students WHERE slack_id = $1';
    try {
      const studentMeetings = await this.client.query(SQL, [slackID]);
      const formattedMeetings = studentMeetings.rows.reduce((acc, item) => {
        const {
          id, response_text, response_date, meeting_notes, // eslint-disable-line
          meeting_date, meeting_status, respond_by_date, reflection_text // eslint-disable-line
        } = item;
        if (id in acc) acc[id].responses.push({ response_text, response_date });
        else {
          acc[id] = {
            id,
            meeting_notes,
            reflection_text,
            meeting_date,
            meeting_status,
            respond_by_date,
            responses: [{ response_text, response_date }],
          };
        }

        return acc;
      }, {});

      const info = await this.client.query(studentInfo, [slackID]);
      return { meetings: Object.values(formattedMeetings), info: info.rows[0] };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Student;
