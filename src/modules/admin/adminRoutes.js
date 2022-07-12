const adminController = require('./../../modules/admin/adminController');
const { Router } = require('express');
const BestProfessionController = require('./BestProfessionController');
const router = new Router();

router.get('/best-profession', async (req, res) => {
  const bestProfession = new BestProfessionController(req, res);
  return await bestProfession.execute();
});

router.get('/best-clients', (req, res) => adminController.bestClients(req, res));

module.exports = router;
