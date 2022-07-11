const { Op } = require('sequelize');

module.exports.byUser = async (req, res) => {
  const { profile } = req;
  const { Contract } = req.app.get('models');
  const contracts = await Contract.findAll({
    where: {
      status: {
        [Op.ne]: 'terminated',
      },
      [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
    },
  });
  if (!contracts.length)
    return res
      .status(404)
      .send({
        message: `No non terminated contracts found for profile id ${profile.id}`,
      })
      .end();
  res.json(contracts);
};

module.exports.byId = async (req, res) => {
  const { profile } = req;
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
    },
  });
  if (!contract)
    return res
      .status(404)
      .send({
        message: `Contract ${id} wasn't found for profile id ${profile.id}`,
      })
      .end();
  res.json(contract);
};
