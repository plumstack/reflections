const express = require('express');

const DB = require('../../database/index');

const router = express.Router();

router.get('/', async (_, res) => {
  const employees = await DB.Employee.getEmployees();
  res.send({ success: true, employees });
});

router.get('/unassigned', async (_, res) => {
  const employees = await DB.Employee.getUnassignedEmployees();
  res.send({ success: true, employees });
});

router.get('/:slackID', async (req, res) => {
  const { slackID } = req.params;
  const employeeMeetings = await DB.Employee.getEmployeeMeetings({ slackID });
  res.send({ success: true, employeeMeetings });
});

router.post('/:slackID/:cohortID', async (req, res) => {
  const { slackID, cohortID } = req.params;
  await DB.Employee.updateEmployeeCohort({ slackID, cohortID });
  res.send({ success: true });
});

module.exports = router;
