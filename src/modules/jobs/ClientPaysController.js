const { canPayJob } = require('./jobsBusiness');
const BaseController = require('../../shared/BaseController');
const { ClientNotFound, JobIdNotAnumber } = require('./JobsErrors');
const { NoClientFound } = require('../../shared/AppErrors');

/**
 * Client pays for a job
 */
class ClientPaysController extends BaseController {
  constructor(req, res, transaction) {
    super(req, res, transaction);
  }

  /**
   * @param {string} req.params.job_id Job id
   * @returns void
   */
  async executeImpl(req, res) {
    const transaction = this.transaction;

    const { profile } = req;
    if (profile.type !== 'client')
      return this.fail(new ClientNotFound(profile.id)); // Quick check using profile loaded by middleware

    const { job_id } = req.params;
    const jobId = Number(job_id);
    if (isNaN(jobId)) return this.fail(new JobIdNotAnumber(job_id));

    const { Contract, Job, Profile } = req.app.get('models');

    const client = await Profile.findOne(
      // Get client inside the transaction (instead of using profile that comes from middleware) to have it locked (transaction uses SERIALIZABLE isolation)
      {
        where: {
          id: profile.id,
          type: 'client',
        },
      },
      { transaction }
    );
    if (!client) return this.fail(new NoClientFound(profile.id)); // Guard for profile type change after req.profile was populated by middleware and this point

    const contracts = await Contract.findAll(
      {
        where: {
          ClientId: profile.id,
        },
        include: Job,
      },
      { transaction }
    );

    const result = canPayJob({ jobId, contracts, client });
    if (result.isFailure) return this.fail(result.error);

    const { contract, job } = result.value;
    const contractor = await Profile.findByPk(contract.ContractorId, {
      transaction,
    });

    // As all the checks passed we can make the payment
    await client.decrement({ balance: job.price }, { transaction });
    await contractor.increment({ balance: job.price }, { transaction });
    job['paid'] = true;
    job['paymentDate'] = new Date().toJSON();
    await job.save({ transaction });

    await this.ok();
  }
}

module.exports = ClientPaysController;
