const adminController = require('./../../modules/admin/adminController');
const { Router } = require('express');
const router = new Router();

router.get('/best-profession', (req, res) =>
  adminController.bestProfession(req, res)
);

router.get('/best-clients', (req, res) => adminController.bestClients(req, res));

module.exports = router;
