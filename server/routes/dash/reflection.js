const express = require('express');
const dateHelper = require('../../helpers/dateConversion');

const DB = require('../../database/index');

const router = express.Router();

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
