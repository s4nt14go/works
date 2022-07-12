const { getProfile } = require('./../../middleware/getProfile');
const jobsController = require('./jobsController');
const ClientPayController = require('./ClientPaysController');
const { Router } = require('express');
const { sequelize } = require('../../model');
const router = new Router();

router.get('/unpaid', getProfile, (req, res) =>
  jobsController.getUnpaid(req, res)
);

router.post('/:job_id/pay', getProfile, async (req, res) => {
  const clientPay = new ClientPayController(
    req,
    res,
    await sequelize.transaction()
  );
  return await clientPay.execute();
});

module.exports = router;
