class Response {
  constructor(client) {
    this.client = client;
  }

  async getNewestMeeting({ slackID }) {
    const SQL = 'SELECT id FROM rs.meetings WHERE employee_id = $1 ORDER BY meeting_date DESC LIMIT 1;';
    try {
      const res = await this.client.query(SQL, [slackID]);
      const { id: newestMeetingID } = res.rows[0];
      return newestMeetingID;
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertResponse({ slackID, responseText, responseDate }) {
    const SQL = 'INSERT INTO rs.response (response_text, response_date, meeting_id) VALUES ($1, $2, $3)';
    const meetingID = await this.getNewestMeeting({ slackID });

    try {
      await this.client.query(SQL, [responseText, responseDate, meetingID]);
      await this.updateMeetingStatus({ meetingID, meetingStatus: 'responded' });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }


  async updateMeetingStatus({ meetingID, meetingStatus }) {
    const SQL = 'UPDATE rs.meetings SET meeting_status = $1 WHERE id = $2;';
    try {
      await this.client.query(SQL, [meetingStatus, meetingID]);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Response;
