class Cohort {
  constructor(client) {
    this.client = client;
  }

  /** retrieves all cohort rows from DB
   * @returns list of all cohorts
   */
  async getCohorts() {
    const SQL = 'SELECT * FROM rs.cohorts;';

    try {
      const currentCohorts = await this.client.query(SQL);
      return currentCohorts.rows;
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
 * Assign the project to an employee.
 * @param {Object} newInfo
 * @param {number} newInfo.cohortID - cohortID of the intended update.
 * @param {string} newInfo.cohortStatus - the new status of the cohort.
 * statuses are: incoming, current, graduated
 */
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

  /**
 * Assign the project to an employee.
 * @param {Object} cohortInfo
 * @param {number} cohortInfo.cohortID - cohortID.
 * @returns list of members in the specified cohort
 */
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
