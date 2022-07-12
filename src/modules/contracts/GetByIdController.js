const BaseController = require('../../shared/BaseController');
const { Op } = require('sequelize');
const { ContractNotFound } = require('./ContractsErrors');

/**
 * Get contract by id
 */
class GetByIdController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  /**
   * @param {string} req.params.id
   * @returns contract
   */
  async executeImpl(req, res) {
    const { profile } = req;
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
      },
    });
    if (!contract) return this.fail(new ContractNotFound(id, profile.id));

    await this.ok({ contract: contract.get() });
  }
}

module.exports = GetByIdController;
