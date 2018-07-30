const dateHelper = require('../helpers/dateConversion');

class Reflection {
  constructor(client, helpers) {
    this.client = client;
    this.helpers = helpers;
  }

  async getAllReflectionsForStudent({ studentID }) {
    const SQL = `SELECT * FROM 
                rs.meetings AS m LEFT JOIN rs.reflections AS r 
                ON m.reflection_id = r.id 
                WHERE m.student_id = $1;`;
    try {
      const allReflectionsForStudent = await this.client.query(SQL, [studentID]);
      return allReflectionsForStudent;
    } catch (error) {
      throw new Error(error);
    }
  }

  async newReflection({
    slackID, reflectionText, meetingDate = dateHelper.nowToPostgres(), meetingNotes, respondBy,
  }) {
    const reflectionsSQL = 'INSERT INTO rs.reflections(reflection_text) VALUES ($1) RETURNING id';
    const newMeetingSQL = `INSERT INTO 
                          rs.meetings(meeting_notes, meeting_date, 
                          reflection_id, student_id, respond_by_date) 
                          VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
    const setStudentStatusSQL = 'UPDATE rs.students SET status = $1, newest_meeting_id = $3 WHERE slack_id = $2;';

    try {
      const insertReflectionID = await this.client.query(reflectionsSQL, [reflectionText]);
      const reflectionID = insertReflectionID.rows[0].id;

      const meetingID = await this
        .client
        .query(
          newMeetingSQL,
          [meetingNotes, meetingDate, reflectionID, slackID, respondBy],
        );

      this.client.query(setStudentStatusSQL, ['needs response', slackID, parseInt(meetingID.rows[0].id, 10)]);

      this
        .helpers
        .slack
        .postMessage(this
          .constructor
          .formatNewReflection({ reflectionText, respondBy }), slackID);
      this
        .helpers
        .slack
        .setReminder({ user: slackID, time: respondBy });
      return reflectionID;
    } catch (error) {
      throw new Error(error);
    }
  }

  static formatNewReflection({ reflectionText, respondBy }) {
    return `You've recieved a new reflection. Please respond to this reflection by ${respondBy}. \n\n ${reflectionText}`;
  }
}

module.exports = Reflection;
