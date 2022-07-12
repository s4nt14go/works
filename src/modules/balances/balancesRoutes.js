const { Router } = require('express');
const balancesController = require('./balancesController');
const router = new Router();

router.post('/deposit/:userId', (req, res) =>
  balancesController.deposit(req, res)
);

module.exports = router;
