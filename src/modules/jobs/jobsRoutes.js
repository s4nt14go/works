const { getProfile } = require('./../../middleware/getProfile');
const jobsController = require('./jobsController');
const { Router } = require('express');
const router = new Router();

router.get('/unpaid', getProfile, (req, res) =>
  jobsController.getUnpaid(req, res)
);

router.post('/:job_id/pay', getProfile, (req, res) =>
  jobsController.clientPays(req, res)
);

module.exports = router;
