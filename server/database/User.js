class User {
  constructor(client) {
    this.client = client;
  }
  async userVerify({ id, accessToken, refreshToken }) {
    const updateTokensSQL = 'UPDATE rs.authedusers SET (accessToken, refreshToken) = ($1, $2) WHERE id = ($3);';
    const verifyUserSQL = 'SELECT * FROM rs.authedUsers WHERE id = ($1);';
    try {
      const verifedUser = await this.client.query(verifyUserSQL, [id]);
      this.client.query(updateTokensSQL, [accessToken, refreshToken, id]);

      if (!verifedUser.rowCount) throw new Error('failedLogin');

      return id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addSessionID({ user, sessionID }) {
    const SQL = 'UPDATE rs.authedusers SET sessionID = ($1) WHERE id = ($2);';
    try {
      const updatedSessionID = await this.client.query(SQL, [sessionID, user]);
      if (!updatedSessionID.rowCount) throw new Error('failedSessionAdd');
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifySession(sessionID) {
    const SQL = 'SELECT * FROM rs.authedUsers WHERE sessionid = $1;';
    try {
      const userFromSessionID = await this.client.query(SQL, [sessionID]);
      if (userFromSessionID.rowCount) return true;
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = User;
