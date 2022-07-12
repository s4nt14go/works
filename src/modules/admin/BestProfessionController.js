const BaseController = require('../../shared/BaseController');
const { sequelize } = require('../../model');
const { Op } = require('sequelize');
const { JobsNotFound } = require('./AdminErrors');

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range
 */
class BestProfessionController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  /**
   * @param {Date} req.start Starting date
   * @param {Date} req.end Ending date
   * @returns profession
   */
  async executeImpl(req, res) {
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

    if (!jobs.length) return this.fail(new JobsNotFound(start, end));

    await this.ok({
      profession: jobs[0].Contract.Contractor.profession,
    });
  }
}

module.exports = BestProfessionController;
