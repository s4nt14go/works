const { Router } = require('express');
const { getProfile } = require('./middleware/getProfile');
const contractsController = require('./controllers/contractsController');
const jobsController = require('./controllers/jobsController');
const profilesController = require('./controllers/profilesController');
const adminController = require('./controllers/adminController');

const router = new Router();

/**
 * @returns contract by id
 */
router.get('/contracts/:id', getProfile, (req, res) =>
  contractsController.byId(req, res)
);

/**
 * Returns a list of non terminated contracts belonging to a user (client or contractor)
 * @returns contracts
 */
router.get('/contracts', getProfile, (req, res) =>
  contractsController.byUser(req, res)
);

/**
 * Get all unpaid jobs for a user (either a client or contractor), for active contracts only
 * @returns jobs
 */
router.get('/jobs/unpaid', getProfile, (req, res) =>
  jobsController.getUnpaid(req, res)
);

/**
 * Client pays for a job
 * @returns void
 */
router.post('/jobs/:job_id/pay', getProfile, (req, res) =>
  jobsController.clientPays(req, res)
);

/**
 * Client deposit
 * @returns void
 */
router.post('/balances/deposit/:userId', (req, res) =>
  profilesController.deposit(req, res)
);

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range
 * @returns profession
 */
router.get('/admin/best-profession', (req, res) =>
  adminController.bestProfession(req, res)
);

/**
 * Returns the client that paid the most for jobs in the query time range
 * @returns profession
 */
router.get('/admin/best-clients', (req, res) =>
  adminController.bestClients(req, res)
);

module.exports = router;
