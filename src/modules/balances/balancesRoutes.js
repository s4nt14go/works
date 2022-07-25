const { Router } = require('express');
const DepositController = require('./DepositController');
const { sequelize } = require('../../model');
const { Transaction } = require('sequelize');
const router = new Router();

router.post('/deposit/:userId', async (req, res) => {
  const deposit = new DepositController(
    req,
    res,
    await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    })
  );
  return await deposit.execute();
});

module.exports = router;
