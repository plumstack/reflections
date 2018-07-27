const dateHelper = require('./../helpers/dateConversion');

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

  async insertResponse({ slackID, responseText, responseDate = dateHelper.nowToPostgres() }) {
    const SQL = 'INSERT INTO rs.response (response_text, response_date, meeting_id) VALUES ($1, $2, $3)';
    const meetingID = await this.getNewestMeeting({ slackID });

    try {
      this.client.query(SQL, [responseText, responseDate, meetingID]);
      this.updateMeetingStatus({ slackID, meetingID, meetingStatus: 'responded' });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateMeetingStatus({ meetingID, meetingStatus, slackID }) {
    const SQL = 'UPDATE rs.meetings SET meeting_status = $1 WHERE id = $2;';
    const SQL2 = 'UPDATE rs.employees SET status = $1 WHERE slack_id = $2;';
    try {
      this.client.query(SQL, [meetingStatus, meetingID]);
      this.client.query(SQL2, [meetingStatus, slackID]);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Response;
