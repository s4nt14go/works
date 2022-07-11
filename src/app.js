const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { Op } = require('sequelize');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
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
});

/**
 * Returns a list of non terminated contracts belonging to a user (client or contractor)
 * @returns contracts
 */
app.get('/contracts', getProfile, async (req, res) => {
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
});

/**
 * Client pays for a job
 * @returns void
 */
app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
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
});

/**
 * Client deposit
 * @returns void
 */
app.post('/balances/deposit/:userId', async (req, res) => {
  const { userId } = req.params;
  const { deposit: depositRaw } = req.body;

  const deposit = Number(depositRaw);
  if (isNaN(deposit))
    return res
      .status(400)
      .send({
        message: `Deposit isn't a number: ${depositRaw}`,
      })
      .end();

  const { Profile, Contract, Job } = req.app.get('models');

  const client = await Profile.findOne({
    where: {
      id: userId,
      type: 'client',
    },
  });
  if (!client)
    return res
      .status(401)
      .send({
        message: `No client found with id: ${userId}`,
      })
      .end();

  const contracts = await Contract.findAll({
    where: {
      ClientId: client.id,
    },
    include: Job,
  });

  let jobsToPay = 0;
  contracts.map((contract) => {
    contract.Jobs.map((job) => {
      if (!job.paid) {
        jobsToPay += job.price;
      }
    });
  });

  // A client can't deposit more than 25% his total of jobs to pay
  const maxDeposit = jobsToPay / 4;
  if (maxDeposit === 0)
    return res
      .status(400)
      .send({
        message: `Client doesn't have jobs to pay`,
      })
      .end();

  if (deposit > maxDeposit)
    return res
      .status(400)
      .send({
        message: `Client can't deposit more than 25% his total of jobs to pay. Maximum deposit allowed: ${maxDeposit}`,
      })
      .end();

  await client.increment({ balance: deposit });

  res.json();
});

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range
 * @returns profession
 */
app.get('/admin/best-profession', async (req, res) => {
  const { start, end } = req.query;

  const { Profile, Contract, Job } = req.app.get('models');

  const jobs = await Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalPaid']],
    order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
    group: ['Contract.Contractor.profession'],
    limit: 1,
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    include: [
      {
        model: Contract,
        include: [
          {
            model: Profile,
            as: 'Contractor',
            where: { type: 'contractor' },
            attributes: ['profession'],
          },
        ],
      },
    ],
  });

  if (!jobs.length)
    return res
      .status(404)
      .send({
        message: `No paid jobs found between ${start} and ${end}`,
      })
      .end();

  res.json({
    profession: jobs[0].Contract.Contractor.profession,
  });
});

/**
 * Returns the client that paid the most for jobs in the query time range
 * @returns profession
 */
app.get('/admin/best-clients', async (req, res) => {
  const { start, end, limit } = req.query;

  const { Profile, Contract, Job } = req.app.get('models');

  const jobs = await Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalPaid']],
    order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
    group: ['Contract.Client.id'],
    limit: limit || 2,
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    include: [
      {
        model: Contract,
        include: [
          {
            model: Profile,
            as: 'Client',
            where: { type: 'client' },
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      },
    ],
  });

  if (!jobs.length)
    return res
      .status(404)
      .send({
        message: `No paid jobs found between ${start} and ${end}`,
      })
      .end();

  const { totalPaid: paid } = jobs[0].get();
  const { id, firstName, lastName } = jobs[0].Contract.Client;
  res.json({
    id,
    fullName: `${firstName} ${lastName}`,
    paid,
  });
});

module.exports = app;
