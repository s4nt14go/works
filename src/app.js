const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { Op } = require('sequelize');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
  const { profileId } = req;
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  if (!contract) return res.status(404).end();
  res.json(contract);
});

/**
 * Returns a list of non terminated contracts belonging to a user (client or contractor)
 * @returns contracts
 */
app.get('/contracts', getProfile, async (req, res) => {
  const { profileId } = req;
  const { Contract } = req.app.get('models');
  const contracts = await Contract.findAll({
    where: {
      status: {
        [Op.ne]: 'terminated',
      },
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  if (!contracts.length) return res.status(404).end();
  res.json(contracts);
});
module.exports = app;
