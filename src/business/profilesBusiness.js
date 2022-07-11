const Result = require('../util/Result');
const { NoJobsToPay, MaximumDepositExceeded } = require('./ProfilesErrors');

/**
 * Check client deposit doesn't exceed maximum amount
 * @param {Object} _ Client contracts, profile and deposit
 * @returns {Result} Success or failure
 */
module.exports.canDeposit = ({ contracts, client, deposit }) => {
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
  if (maxDeposit === 0) return Result.fail(new NoJobsToPay(client.id));

  if (deposit > maxDeposit)
    return Result.fail(new MaximumDepositExceeded(maxDeposit));

  return Result.ok();
};
