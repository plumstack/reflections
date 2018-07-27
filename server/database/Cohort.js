class Cohort {
  constructor(client) {
    this.client = client;
  }

  async getCohorts() {
    const SQL = 'SELECT * FROM rs.cohorts;';

    try {
      const currentCohorts = await this.client.query(SQL);
      return currentCohorts.rows;
    } catch (error) {
      throw new Error(error);
    }
  }
  // statuses are: incoming, current, graduated
  async updateCohortStatus({ cohortID, cohortStatus }) {
    const SQL = 'UPDATE rs.cohorts SET cohort_status = $1 WHERE id = $2';

    try {
      await this.client.query(SQL, [cohortStatus, cohortID]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getCohortMembers({ cohortID }) {
    const SQL = 'SELECT * FROM rs.students WHERE cohort_id = $1';
    try {
      const cohortMembers = await this.client.query(SQL, [cohortID]);
      return cohortMembers.rows;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Cohort;
