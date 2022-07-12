const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const contractsRoutes = require('./modules/contracts/contractsRoutes');
const adminRoutes = require('./modules/admin/adminRoutes');
const jobsRoutes = require('./modules/jobs/jobsRoutes');
const balancesRoutes = require('./modules/balances/balancesRoutes');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts', contractsRoutes);
app.use('/admin', adminRoutes);
app.use('/jobs', jobsRoutes);
app.use('/balances', balancesRoutes);

module.exports = app;
