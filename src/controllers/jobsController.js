const { sequelize } = require('../model');
const { Op } = require('sequelize');
const { canPayJob } = require('../business/jobsBusiness');

/**
 * Client pays for a job
 * @param {string} req.params.job_id Job id
 * @returns void
 */
module.exports.clientPays = async (req, res) => {
  const { profile } = req;
  if (profile.type !== 'client')
    return res
      .status(404)
      .send({
        message: `There is no client with profile id: ${profile.id}`,
      })
      .end();

  const { Contract, Job, Profile } = req.app.get('models');

  const contracts = await Contract.findAll({
    where: {
      ClientId: profile.id,
    },
    include: Job,
  });

  const { job_id } = req.params;

  const result = canPayJob({ job_id, contracts, client: profile });
  if (result.isFailure)
    return res
      .status(result.error.httpStatus)
      .send({
        message: result.error.message,
        type: result.error.type,
      })
      .end();

  const { contract, job } = result.value;
  const contractor = await Profile.findByPk(contract.ContractorId);

  // As all the checks passed we can make the payment
  const paymentTransaction = await sequelize.transaction();
  await profile.decrement(
    { balance: job.price },
    { transaction: paymentTransaction }
  );
  await contractor.increment(
    { balance: job.price },
    { transaction: paymentTransaction }
  );
  job['paid'] = true;
  job['paymentDate'] = new Date().toJSON();
  await job.save({ transaction: paymentTransaction });
  await paymentTransaction.commit();

  res.json();
};

/**
 * Get all unpaid jobs for a user (either a client or contractor), for active contracts only
 * @returns jobs
 */
module.exports.getUnpaid = async (req, res) => {
  const { profile } = req;

  const { Contract, Job } = req.app.get('models');

  const contracts = await Contract.findAll({
    where: {
      status: 'in_progress',
      [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
    },
    include: {
      model: Job,
      where: {
        paid: {
          [Op.not]: true,
        },
      },
    },
  });

  const unpaidJobs = [];
  contracts.map((contract) => {
    contract.Jobs.map((job) => {
      unpaidJobs.push(job.get());
    });
  });

  res.json(unpaidJobs);
};
