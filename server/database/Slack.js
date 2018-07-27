class SlackDB {
  constructor(client) {
    this.client = client;
  }

  async updateUserInfo({ userList }) {
    const users = Object.keys(userList);
    try {
      Promise.all(users
        .map((item) => this.insertNewStudent({ slackId: item, studentName: userList[item] })));
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertNewStudent({ slackId, studentName }) {
    const SQL = 'INSERT INTO rs.students(name, slack_id) VALUES ($1, $2) ON CONFLICT (slack_id) DO NOTHING;';
    try {
      const newStudentInsert = this.client.query(SQL, [studentName, slackId]);
      return newStudentInsert;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCohortInfo({ cohortList }) {
    const cohorts = Object.values(cohortList);
    try {
      Promise.all(cohorts.map((item) => this.insertNewCohort(item)));
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertNewCohort({ name, archived }) {
    const SQL = 'INSERT INTO rs.cohorts(id, cohort_status) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING;';
    // removes the hratx prefix and parses the cohort number only if the remains is a number
    const cohortID = Number(name.replace('hratx', ''));

    // protects against cases where the hratx prefix is used, but not followed by a cohort number
    // should also be safe against special channels like hratx34resume due to Number constructor
    if (Number.isNaN(cohortID)) return null;

    try {
      // inserts new cohorts with their numbers as the ID and a status of graduated or archived.
      const newCohortInsert = this.client.query(SQL, [cohortID, archived ? 'graduated' : 'incoming']);
      return newCohortInsert;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = SlackDB;
