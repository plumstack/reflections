class Employee {
  constructor(client) {
    this.client = client;
  }

  async getEmployees() {
    const SQL = 'SELECT * FROM rs.employees;';
    try {
      const currentEmployees = await this.client.query(SQL);
      return currentEmployees.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUnassignedEmployees() {
    const SQL = 'SELECT * FROM rs.employees WHERE cohort_id = 0;';
    try {
      const unassignedEmployees = await this.client.query(SQL);
      return unassignedEmployees.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateEmployeeCohort({ slackID, cohortID }) {
    const SQL = 'UPDATE rs.employees SET cohort_id = $1 where slack_id = $2;';
    try {
      await this.client.query(SQL, [cohortID, slackID]);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getEmployeeMeetings({ slackID }) {
    const SQL = `SELECT m.id, m.meeting_notes, m.meeting_date, m.meeting_status, m.respond_by_date, r.reflection_text, re.response_text, re.response_date
                FROM rs.meetings AS m 
                LEFT JOIN rs.reflections AS r 
                  ON (m.reflection_id = r.id)
                LEFT JOIN rs.response AS re
                  ON (re.meeting_id = m.id)
                WHERE m.employee_id = $1;`;
    const SQL2 = 'SELECT * FROM rs.employees WHERE slack_id = $1';
    try {
      const employeeMeetings = await this.client.query(SQL, [slackID]);
      const formattedMeetings = employeeMeetings.rows.reduce((acc, item) => {
        const {
          id, response_text, response_date, meeting_notes, // eslint-disable-line
          meeting_date, meeting_status, respond_by_date, // eslint-disable-line
        } = item;
        if (id in acc) acc[id].responses.push({ response_text, response_date });
        else {
          acc[id] = {
            id,
            meeting_notes,
            meeting_date,
            meeting_status,
            respond_by_date,
            responses: [{ response_text, response_date }],
          };
        }

        return acc;
      }, {});

      const info = await this.client.query(SQL2, [slackID]);
      return { meetings: Object.values(formattedMeetings), info: info.rows[0] };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Employee;
