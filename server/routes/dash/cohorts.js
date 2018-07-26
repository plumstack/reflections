const express = require('express');

const DB = require('../../database/index');

const router = express.Router();

router.get('/', async (_, res) => {
  const cohorts = await DB.Cohort.getCohorts();
  res.send({ success: true, cohorts });
});

router.get('/:cohortID', async (req, res) => {
  const { cohortID } = req.params;
  const cohortMemebers = await DB.Cohort.getCohortMembers({ cohortID });
  res.send({ success: true, cohortMemebers });
});

router.post('/:cohortID/:status', async (req, res) => {
  const { cohortID, status: cohortStatus } = req.params;
  await DB.Cohort.updateCohortStatus({ cohortID, cohortStatus });
  res.send({ success: true });
});

module.exports = router;