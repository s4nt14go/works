const { canDeposit } = require('./balancesBusiness');
const BaseController = require('../../shared/BaseController');
const { DepositNotAnumber } = require('./BalancesErrors');
const { NoClientFound } = require('../../shared/Errors');

/**
 * Client pays for a job
 */
class DepositController extends BaseController {
  constructor(req, res, transaction) {
    super(req, res, transaction);
  }

  /**
   * @param {string} req.params.job_id Job id
   * @returns void
   */
  async executeImpl(req, res) {
    const transaction = this.transaction;
    const { userId } = req.params;
    const { deposit: depositRaw } = req.body;

    const deposit = Number(depositRaw);
    if (isNaN(deposit)) return this.fail(new DepositNotAnumber(depositRaw));

    const { Profile, Contract, Job } = req.app.get('models');

    const client = await Profile.findOne(
      {
        where: {
          id: userId,
          type: 'client',
        },
      },
      { transaction }
    );
    if (!client) return this.fail(new NoClientFound(userId));

    const contracts = await Contract.findAll(
      {
        where: {
          ClientId: client.id,
        },
        include: Job,
      },
      { transaction }
    );

    const result = canDeposit({ contracts, client, deposit });
    if (result.isFailure) return this.fail(result.error);

    await client.increment({ balance: deposit }, { transaction });

    await this.ok();
  }
}

module.exports = DepositController;
