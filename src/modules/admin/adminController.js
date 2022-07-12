const { Op } = require('sequelize');
const { sequelize } = require('../../model');

/**
 * Returns the clients that paid the most for jobs in the query time range
 * @param {Date} req.query.start Starting date
 * @param {Date} req.query.end Ending date
 * @returns clients
 */
module.exports.bestClients = async (req, res) => {
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

  const result = [];
  jobs.map((job) => {
    const { totalPaid: paid } = job.get();
    const { id, firstName, lastName } = job.Contract.Client;
    result.push({
      id,
      fullName: `${firstName} ${lastName}`,
      paid,
    });
  });

  res.json(result);
};
