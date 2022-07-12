const { Router } = require('express');
const BestProfessionController = require('./BestProfessionController');
const BestClientsController = require("./BestClientsController");
const router = new Router();

router.get('/best-profession', async (req, res) => {
  const bestProfession = new BestProfessionController(req, res);
  return await bestProfession.execute();
});

router.get('/best-clients', async (req, res) => {
  const bestClients = new BestClientsController(req, res);
  return await bestClients.execute();
});

module.exports = router;
