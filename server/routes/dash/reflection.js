const express = require('express');
const dateHelper = require('../../helpers/dateConversion');

const DB = require('../../database/index');

const router = express.Router();

router.use(async (req, res, next) => {
  const { sessionID } = req;

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
});

router.post('/:slackID', async (req, res) => {
  const { slackID } = req.params;
  const {
    reflectionText, meetingNotes, respondBy, tag,
  } = req.body;

  const reflectionID = await DB.Reflection.newReflection({
    slackID, reflectionText, meetingNotes, respondBy: dateHelper.toPostgres(respondBy),
  });

  DB.Tag.tagReflection({ tag, reflectionID });
  res.send({ success: true });
});

module.exports = router;
