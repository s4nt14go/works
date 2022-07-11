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

app.get(
  '/contracts/:id',
  getProfile,
  (req, res) => contractsController.byId(req, res)
);

app.get(
  '/contracts',
  getProfile,
  (req, res) => contractsController.byUser(req, res)
);

app.get(
  '/jobs/unpaid',
  getProfile,
  (req, res) => jobsController.getUnpaid(req, res)
);

app.post(
  '/jobs/:job_id/pay',
  getProfile,
  (req, res) => jobsController.clientPays(req, res)
);

app.post(
  '/balances/deposit/:userId',
  (req, res) => profilesController.deposit(req, res)
);

app.get(
  '/admin/best-profession',
  (req, res) => adminController.bestProfession(req, res)
);

app.get(
  '/admin/best-clients',
  (req, res) => adminController.bestClients(req, res)
);

module.exports = app;
