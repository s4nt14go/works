const { JobIsAlreadyPaid, JobNotFound, NotEnoughFunds } = require('./JobsErrors');
const Result = require('../../util/Result');

/**
 * Check client can pay for the job
 * @param {Object} _ Job id, client contracts and client profile
 * @returns {Result} Success or failure
 */
module.exports.canPayJob = ({ jobId, contracts, client }) => {
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
