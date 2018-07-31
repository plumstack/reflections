const { WebClient, RTMClient } = require('@slack/client');
const dotenv = require('dotenv');
const schedule = require('node-schedule');
const DB = require('../database/index');

dotenv.config({ silent: true });

const { BOT_OAUTH, USER_OAUTH } = process.env;

class Slack {
  constructor(botOauth, userOauth) {
    this.bot_oauth = botOauth;
    this.user_oauth = userOauth;
    if (!this.bot_oauth || !this.user_oauth) {
      console.log('\x1b[33m%s\x1b[0m', '\nPlease add the slack env variables. This is either BOT_OAUTH or USER_OAUTH.');
      process.exit(1);
    }
    try {
      this.web = new WebClient(this.bot_oauth);
      this.rtm = new RTMClient(this.bot_oauth);
    } catch (error) {
      console.error(error);
    }

    this.userList = {};
    this.channelList = {};
    this.botID = process.env.BOTID;

    this.rtm.start();
    this.updateInfo();
    this.eventListener();
    this.checkOverdue();

    schedule.scheduleJob({ minute: 30 }, () => {
      this.updateInfo();
    });
    schedule.scheduleJob({ hour: 9, minute: 5 }, () => {
      this.checkOverdue();
    }); // run everyday at midnight
  }

  setReminder({ text = 'Respond to Reflections Bot', time, user }) {
    try {
      this.web.apiCall('reminders.add', {
        text,
        time,
        user,
        token: this.user_oauth,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async checkOverdue() {
    const overdueStudents = await DB.Student.getOverdueStudents();
    overdueStudents.forEach((student) => {
      this.postMessage('Your reflection is due. Please respond ASAP.', student);
    });
  }

  getUsers() {
    return this.userList;
  }

  getChannels() {
    return this.channelList;
  }

  async postMessage(text, user) {
    try {
      const newIM = await this.web.im.open({ user });

      this.rtm.sendMessage(text, newIM.channel.id);
    } catch (error) {
      throw new Error(`ERROR: SLACKBOT POST MESSAGE: ${error}`);
    }
  }

  async updateInfo() {
    // const newUserList = this.web.users.list();
    // const newChannelList = this.web.channels.list();
    const [newUserList, newChannelList] =
       await Promise.all([this.web.users.list(), this.web.channels.list()]);

    if (!this.botID) {
      console.log(newUserList);
      console.log('\x1b[33m%s\x1b[0m', '\nPlease add the botID env variable from this list. The bot name is "reflections". Afterwards rebuild the app');
      process.exit(1);
    }

    this.userList = newUserList.members.reduce((acc, item) => {
      if (!item.is_bot && item.name !== 'slackbot') acc[item.id] = item.profile.real_name;
      return acc;
    }, {});

    this.channelList = newChannelList.channels.reduce((acc, item) => {
      if (item.name.slice(0, 5) === 'hratx') {
        acc[item.id] = { name: item.name, members: item.members, archived: item.is_archived };
      }
      return acc;
    }, {});

    DB.Slack.updateCohortInfo({ cohortList: this.channelList });
    DB.Slack.updateUserInfo({ userList: this.userList });
  }

  eventListener() {
    // UNCOMMENT THIS LINE TO DEBUG ALL SLACK EVENTS
    // this.rtm.on('slack_event', (event, info) => console.log(info));
    this.rtm.on('ready', () => console.log('Slack RTM connected.'));
    this.rtm.on('message', (event) => {
      if (event.channel[0] === 'D' && event.user !== this.botID) {
        const { user: slackID, text: responseText } = event;
        DB.Response.insertResponse({ slackID, responseText });
        this.postMessage('Your reply to this reflection has been saved. Feel free to send another message', event.user);
      }
    });
  }
}
const slack = new Slack(BOT_OAUTH, USER_OAUTH);

module.exports = slack;
