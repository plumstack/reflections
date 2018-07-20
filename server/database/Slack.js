class SlackDB {
  constructor(client) {
    this.client = client;
  }

  async getEmployees() {
    const getEmployeesSQL = 'SELECT * FROM rs.employees;';
    try {
      const currentEmployees = await this.client.query(getEmployeesSQL);
      return currentEmployees;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserInfo({ userList }) {
    const users = Object.keys(userList);
    try {
      Promise.all(users.map((item) => this.insertNewEmployee({ slackId: item, employeeName: userList[item] })));
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertNewEmployee({ slackId, employeeName }) {
    const newEmployeeSQL = 'INSERT INTO rs.employees(employee_name, slack_id, cohort_id) VALUES ($1, $2, 0) ON CONFLICT (slack_id) DO NOTHING;';
    try {
      const newEmployeeInsert = this.client.query(newEmployeeSQL, [employeeName, slackId]);
      return newEmployeeInsert;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = SlackDB;
