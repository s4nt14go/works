const BaseController = require('../../shared/BaseController');
const { Op } = require('sequelize');
const { NonTerminatedContractsNotFound } = require('./ContractsErrors');

/**
 * Returns a list of non terminated contracts belonging to a user (client or contractor)
 */
class GetContractsController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  /**
   * @returns contracts
   */
  async executeImpl(req, res) {
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
      return this.fail(new NonTerminatedContractsNotFound(profile.id));

    await this.ok({ contracts });
  }
}

module.exports = GetContractsController;
