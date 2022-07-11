const { Router } = require('express');
const { getProfile } = require('./middleware/getProfile');
const contractsController = require('./controllers/contractsController');
const jobsController = require('./controllers/jobsController');
const profilesController = require('./controllers/profilesController');
const adminController = require('./controllers/adminController');

const router = new Router();

router.get('/contracts/:id', getProfile, (req, res) =>
  contractsController.byId(req, res)
);

router.get('/contracts', getProfile, (req, res) =>
  contractsController.byUser(req, res)
);

router.get('/jobs/unpaid', getProfile, (req, res) =>
  jobsController.getUnpaid(req, res)
);

router.post('/jobs/:job_id/pay', getProfile, (req, res) =>
  jobsController.clientPays(req, res)
);

router.post('/balances/deposit/:userId', (req, res) =>
  profilesController.deposit(req, res)
);

router.get('/admin/best-profession', (req, res) =>
  adminController.bestProfession(req, res)
);

router.get('/admin/best-clients', (req, res) =>
  adminController.bestClients(req, res)
);

module.exports = router;
