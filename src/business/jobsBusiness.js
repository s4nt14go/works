const {
  InvalidJobId,
  JobIsAlreadyPaid,
  JobNotFound,
  NotEnoughFunds,
} = require('./jobsErrors');
const Result = require('../util/Result');

/**
 * Check client can pays for the job
 * @param {number} job_id Job id
 * @param {Object[]} contracts Client contracts
 * @param {Object} client Client profile
 * @returns {Object} Contract and job when success, error when failure
 */
module.exports.canPayJob = ({job_id, contracts, client}) => {
  const jobId = Number(job_id);
  if (isNaN(jobId)) return Result.fail(new InvalidJobId(job_id));

  let jobFound = false,
    contractFound = false;

  for (let i = 0; i < contracts.length; i++) {
    for (let j = 0; j < contracts[i].Jobs.length; j++) {
      const job = contracts[i].Jobs[j];
      if (job.id === jobId) {
        if (job.paid) {
          return Result.fail(new JobIsAlreadyPaid(job.id));
        }
        jobFound = job;
        contractFound = contracts[i];
      }
    }
  }

  if (!jobFound) return Result.fail(new JobNotFound(jobId, client.id));

  if (client.balance < jobFound.price)
    return Result.fail(new NotEnoughFunds(jobId, client.id));

  return Result.ok({
    contract: contractFound,
    job: jobFound,
  });
};
