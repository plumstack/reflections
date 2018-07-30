const { Client } = require('pg');
const dotenv = require('dotenv');
const User = require('./User');
const SlackDB = require('./Slack');
const Cohort = require('./Cohort');
const Reflection = require('./Reflection');
const Tag = require('./Tag');
const Response = require('./Response');
const Student = require('./Student');

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

module.exports = DB;

const slack = require('../api/slack');

DB.helpers.slack = slack;
