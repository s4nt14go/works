const { canPayJob } = require('./jobsBusiness');
const BaseController = require('../../shared/BaseController');
const { ClientNotFound, JobIdNotAnumber } = require('./JobsErrors');

/**
 * Client pays for a job
 * @param {string} req.params.job_id Job id
 * @returns void
 */
class ClientPaysController extends BaseController {
  constructor(req, res, transaction) {
    super(req, res, transaction);
  }

  async executeImpl(req, res) {
    const transaction = this.transaction;

    const { profile } = req;
    if (profile.type !== 'client')
      return this.fail(new ClientNotFound(profile.id));

    const { job_id } = req.params;
    const jobId = Number(job_id);
    if (isNaN(jobId)) return this.fail(new JobIdNotAnumber(job_id));

    const { Contract, Job, Profile } = req.app.get('models');

    const contracts = await Contract.findAll(
      {
        where: {
          ClientId: profile.id,
        },
        include: Job,
      },
      { transaction, lock: true }
    );

    const result = canPayJob({ jobId, contracts, client: profile });
    if (result.isFailure) return this.fail(result.error);

    const { contract, job } = result.value;
    const contractor = await Profile.findByPk(contract.ContractorId, {
      transaction,
      lock: true,
    });

    // As all the checks passed we can make the payment
    await profile.decrement({ balance: job.price }, { transaction });
    await contractor.increment({ balance: job.price }, { transaction });
    job['paid'] = true;
    job['paymentDate'] = new Date().toJSON();
    await job.save({ transaction });

    await this.ok();
  }
}

module.exports = ClientPaysController;
