const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const contractsController = require('./controllers/contractsController');
const jobsController = require('./controllers/jobsController');
const profilesController = require('./controllers/profilesController');
const adminController = require('./controllers/adminController');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * @returns contract by id
 */
app.get(
  '/contracts/:id',
  getProfile,
  async (req, res) => await contractsController.byId(req, res)
);

/**
 * Returns a list of non terminated contracts belonging to a user (client or contractor)
 * @returns contracts
 */
app.get(
  '/contracts',
  getProfile,
  async (req, res) => await contractsController.byUser(req, res)
);

/**
 * Get all unpaid jobs for a user (either a client or contractor), for active contracts only
 * @returns jobs
 */
app.get(
  '/jobs/unpaid',
  getProfile,
  async (req, res) => await jobsController.getUnpaid(req, res)
);

/**
 * Client pays for a job
 * @returns void
 */
app.post(
  '/jobs/:job_id/pay',
  getProfile,
  async (req, res) => await jobsController.clientPays(req, res)
);

/**
 * Client deposit
 * @returns void
 */
app.post(
  '/balances/deposit/:userId',
  async (req, res) => await profilesController.deposit(req, res)
);

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range
 * @returns profession
 */
app.get(
  '/admin/best-profession',
  async (req, res) => await adminController.bestProfession(req, res)
);

/**
 * Returns the client that paid the most for jobs in the query time range
 * @returns profession
 */
app.get(
  '/admin/best-clients',
  async (req, res) => await adminController.bestClients(req, res)
);

module.exports = app;
