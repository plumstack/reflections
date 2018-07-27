const { Client } = require('pg');
const dotenv = require('dotenv');
const User = require('./User');
const SlackDB = require('./Slack');
const Cohort = require('./Cohort');
const Reflection = require('./Reflection');
const Tag = require('./Tag');
const Response = require('./Response');
const Student = require('./Student');

const dateHelper = require('../helpers/dateConversion');

dotenv.config({ silent: true });

const { PSQL_CONNECTION_STRING: connectionString } = process.env;

class Database {
  constructor() {
    this.client = new Client({
      connectionString,
    });
    this.User = new User(this.client);
    this.Slack = new SlackDB(this.client);
    this.Cohort = new Cohort(this.client);
    this.Tag = new Tag(this.client);
    this.helpers = {};
    this.Response = new Response(this.client);
    this.Reflection = new Reflection(this.client, this.helpers);
    this.Student = new Student(this.client);
    this.initConnection();
  }

  async initConnection() {
    try {
      await this.client.connect();
      console.log('connection to database successful');
    } catch (error) {
      console.log('DATABASE CONNECTION ERROR', error);
    }
  }
}

const DB = new Database();
// DB.Response.insertResponse({ slackID: 'UBTN15WFM', responseText: 'response', responseDate: dateHelper.nowToPostgres() });

// UBTN15WFM
module.exports = DB;

const slack = require('../api/slack');

// DB.Student.getStudentMeetings({ slackID: 'UBTN15WFM' }).then(console.log);

DB.helpers.slack = slack;

// DB.Reflection.newReflection({
//   slackID: 'UBTSH2Z0D', reflectionText: 'reflection message test', meetingNotes: 'please work', meetingDate: dateHelper.nowToPostgres(), respondBy: dateHelper.nowToPostgres(),
// });
