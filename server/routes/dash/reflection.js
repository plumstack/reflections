const express = require('express');
const dateHelper = require('../../helpers/dateConversion');

const DB = require('../../database/index');

const router = express.Router();

router.post('/:slackID', async (req, res) => {
  const { slackID } = req.params;
  const {
    reflectionText, meetingNotes, respondBy,
  } = req.body;

  await DB.Reflection.newReflection({
    slackID, reflectionText, meetingNotes, respondBy: dateHelper.toPostgres(respondBy),
  });
  res.send({ success: true });
});

module.exports = router;
