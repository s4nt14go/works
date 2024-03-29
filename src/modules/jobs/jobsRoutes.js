const { getProfile } = require('./../../middleware/getProfile');
const ClientPayController = require('./ClientPaysController');
const { Router } = require('express');
const GetUnpaidController = require('./GetUnpaidController');
const { sequelize } = require('../../model');
const { Transaction } = require('sequelize');
const router = new Router();

router.get('/unpaid', getProfile, async (req, res) => {
  const getUnpaid = new GetUnpaidController(req, res);
  return await getUnpaid.execute();
});

router.post('/:job_id/pay', getProfile, async (req, res) => {
  const clientPay = new ClientPayController(
    req,
    res,
    await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    })
  );
  return await clientPay.execute();
});

module.exports = router;
