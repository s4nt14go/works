const { sequelize } = require('../model');
const { Op } = require('sequelize');

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

  const jobId = Number(job_id);
  if (isNaN(jobId))
    return res
      .status(400)
      .send({
        message: `Job id received isn't a number: ${job_id}`,
      })
      .end();

  let jobFound = false,
    contractFound = false;
  contracts.map((contract) => {
    contract.Jobs.map((job) => {
      if (job.id === jobId) {
        if (job.paid) {
          return res
            .status(403)
            .send({
              message: `Job ${job.id} is already paid`,
            })
            .end();
        }
        jobFound = job;
        contractFound = contract;
      }
    });
  });
  if (!jobFound)
    return res
      .status(404)
      .send({
        message: `Job ${jobId} wasn't found for client ${profile.id}`,
      })
      .end();

  if (profile.balance < jobFound.price)
    return res
      .status(409)
      .send({
        message: `Client ${profile.id} don't have enough funds to pay job ${jobFound.id}`,
      })
      .end();

  const contractor = await Profile.findByPk(contractFound.ContractorId);

  // As all the checks passed we can make the payment
  const paymentTransaction = await sequelize.transaction();
  await profile.decrement(
    { balance: jobFound.price },
    { transaction: paymentTransaction }
  );
  await contractor.increment(
    { balance: jobFound.price },
    { transaction: paymentTransaction }
  );
  jobFound.paid = true;
  await jobFound.save({ transaction: paymentTransaction });
  await paymentTransaction.commit();

  res.json();
};

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
