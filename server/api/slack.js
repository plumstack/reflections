const { WebClient, RTMClient } = require('@slack/client');
const dotenv = require('dotenv');
const schedule = require('node-schedule');
const DB = require('../database/index');

dotenv.config({ silent: true });

const { BOT_OAUTH, USER_OAUTH } = process.env;

// This class handles interaction with the slack API.
class Slack {
  constructor(botOauth, userOauth) {
    this.bot_oauth = botOauth;
    this.user_oauth = userOauth;
    // If the needed slack ENV variables don't exist exit the node process.
    if (!this.bot_oauth || !this.user_oauth) {
      console.log('\x1b[33m%s\x1b[0m', '\nPlease add the slack env variables. This is either BOT_OAUTH or USER_OAUTH.');
      process.exit(1);
    }
    // attempt to instanstiate api wrappers, if failed log the error and exit
    try {
      this.web = new WebClient(this.bot_oauth);
      this.rtm = new RTMClient(this.bot_oauth);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }

    this.userList = {};
    this.channelList = {};
    this.botID = process.env.BOTID;

    // on server start run init functions to get any new info and start the RTM listener
    this.rtm.start();
    this.updateInfo();
    this.eventListener();
    this.checkOverdue();

    // schedule the channel and user update checker to run hourly on the xx:30 mark
    schedule.scheduleJob({ minute: 30 }, () => {
      this.updateInfo();
    });
    // schedule the overdue checker to run at 09:05AM daily
    schedule.scheduleJob({ hour: 9, minute: 5 }, () => {
      this.checkOverdue();
    }); // run everyday at midnight
  }

  /**
 * Sets a reminder for a user via the slack reminder system.
 * @param {string} text - The reminder text for the user.
 * @param {string} time -  The date and time the reminder will be set at
 * @param {string} user - The users slackID.
 */
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

  /**
 * Retrieves any students with an overdue status and sends them a message. Runs at 09:05AM daily.
 */
  async checkOverdue() {
    const overdueStudents = await DB.Student.getOverdueStudents();
    overdueStudents.forEach((student) => {
      this.postMessage('Your reflection is due. Please respond ASAP.', student);
    });
  }

  /**
 * @returns all current slack users.
 */
  getUsers() {
    return this.userList;
  }

  /**
 * @returns all current slack channels.
 */
  getChannels() {
    return this.channelList;
  }

  /**
   * Posts a message to a user via the slack RTM api
   * @param {string} text - The message to be posted to the user
   * @param {string} user - The slackID for the user.
   */
  async postMessage(text, user) {
    try {
      // creates or retrieves the DM channel ID with the user.
      const newIM = await this.web.im.open({ user });

      this.rtm.sendMessage(text, newIM.channel.id);
    } catch (error) {
      throw new Error(`ERROR: SLACKBOT POST MESSAGE: ${error}`);
    }
  }

  /**
   * Updates the channels and user list from slack. Runs on every xx:30 mark.
   */
  async updateInfo() {
    const [newUserList, newChannelList] =
       await Promise.all([this.web.users.list(), this.web.channels.list()]);

    // If not bot ID exists (IE on the first run) prints a list of users and their IDs and exits.
    if (!this.botID) {
      console.log(newUserList);
      console.log('\x1b[33m%s\x1b[0m', '\nPlease add the botID env variable from this list. The bot name is "reflections". Afterwards rebuild the app');
      process.exit(1);
    }

    // takes the returned userlist, removes all bots, and returns an object with a ID:NAME pair
    this.userList = newUserList.members.reduce((acc, item) => {
      if (!item.is_bot && item.name !== 'slackbot') acc[item.id] = item.profile.real_name;
      return acc;
    }, {});

    // returns array of cohort channel information
    this.channelList = newChannelList.channels.reduce((acc, item) => {
      if (item.name.slice(0, 5) === 'hratx') {
        acc[item.id] = { name: item.name, members: item.members, archived: item.is_archived };
      }
      return acc;
    }, {});

    DB.Slack.updateCohortInfo({ cohortList: this.channelList });
    DB.Slack.updateUserInfo({ userList: this.userList });
  }

  /**
   * RTM listener for slack messages
   */
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
