const { Op } = require('sequelize');

/**
 * Get contract by id
 * @param {string} req.params.id
 * @returns contract
 */
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
