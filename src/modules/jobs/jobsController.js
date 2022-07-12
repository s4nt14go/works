const { Op } = require('sequelize');

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
