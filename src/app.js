const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const {Op} = require("sequelize");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: req.profile }, { ClientId: req.profile }],
    },
  });
  if (!contract) return res.status(404).end();
  res.json(contract);
});
module.exports = app;
