const express = require('express');

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

router.get('/', async (_, res) => {
  const students = await DB.Student.getStudents();
  res.send({ success: true, students });
});

router.get('/unassigned', async (_, res) => {
  const students = await DB.Student.getUnassignedStudents();
  res.send({ success: true, students });
});

router.get('/:slackID', async (req, res) => {
  const { slackID } = req.params;
  const meetings = await DB.Student.getStudentMeetings({ slackID });
  console.log(meetings);
  res.send({ success: true, meetings: meetings.meetings, info: meetings.info });
});

router.post('/:slackID/:cohortID', async (req, res) => {
  const { slackID, cohortID } = req.params;
  await DB.Student.updateStudentCohort({ slackID, cohortID });
  res.send({ success: true });
});

module.exports = router;
