const { WebClient, RTMClient } = require('@slack/client');
const dotenv = require('dotenv');
const db = require('./database/index');

dotenv.config({ silent: true });

const { BOT_OAUTH, USER_OAUTH } = process.env;

class Slack {
  constructor(botOauth, userOauth) {
    this.bot_oauth = botOauth;
    this.user_oauth = userOauth;
    try {
      this.web = new WebClient(this.bot_oauth);
      this.rtm = new RTMClient(this.bot_oauth);
    } catch (error) {
      console.error(error);
    }

    this.userList = {};
    this.channelList = {};
    this.botID = 'UBTSJ81UM';

    this.rtm.start();
    this.updateInfo();
    this.eventListener();
    setInterval(() => this.updateInfo, 1800000);
  }

  setReminder(text = 'Respond to Reflections Bot', time, user) {
    this.web.apiCall('reminders.add', {
      text,
      time,
      user,
      token: this.user_oauth,
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
    const newUserList = await this.web.users.list();
    const newChannelList = await this.web.channels.list();

    this.userList = newUserList.members.reduce((acc, item) => {
      if (!item.is_bot && item.name !== 'slackbot') acc[item.id] = item.name;
      return acc;
    }, {});

    this.channelList = newChannelList.channels.reduce((acc, item) => {
      acc[item.id] = { name: item.name, members: item.members };
      return acc;
    }, {});
  }

  eventListener() {
    this.rtm.on('ready', () => console.log('Slack RTM connected.'));
    this.rtm.on('message', (event) => {
      if (event.channel[0] === 'D' && event.user !== this.botID) {
        // TODO: DB FUNCTION
        this.postMessage('Your reply to this reflection has been saved. Feel free to send another message //TODO', event.user);
      }
    });
  }
}

const slack = new Slack(BOT_OAUTH, USER_OAUTH);

module.exports = slack;
