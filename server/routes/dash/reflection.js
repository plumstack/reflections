const express = require('express');
const dotenv = require('dotenv');
const dateHelper = require('../../helpers/dateConversion');
const DB = require('../../database/index');

dotenv.config({ silent: true });

const router = express.Router();
const { BUILD } = process.env;

router.use(async (req, res, next) => {
  const { sessionID } = req;
  if (BUILD !== 'PRODUCTION') {
    next();
  } else {
    try {
      const sessionCheckResult = await DB.User.verifySession(sessionID);
      if (sessionCheckResult) next();
      else {
        res.status(403);
        res.send('Unauthorized');
      }
    } catch (error) {
      throw new Error(error);
    }
  }
});

router.post('/:slackID', async (req, res) => {
  const { slackID } = req.params;
  const {
    reflectionText, meetingNotes, respondBy, tags,
  } = req.body;

  const reflectionID = await DB.Reflection.newReflection({
    slackID, reflectionText, meetingNotes, respondBy: dateHelper.toPostgres(respondBy),
  });

  Promise.all(tags.map((tag) => DB.Tag.tagReflection({ tag, reflectionID })));
  res.send({ success: true });
});

module.exports = router;
