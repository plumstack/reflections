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
}

module.exports = Employee;
