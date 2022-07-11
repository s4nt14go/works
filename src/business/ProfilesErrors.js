const BaseError = require('../util/BaseError');

class NoJobsToPay extends BaseError {
  constructor(clientId) {
    super(`Client ${clientId} doesn't have jobs to pay`, 404);
  }
}

class MaximumDepositExceeded extends BaseError {
  constructor(maxDeposit) {
    super(
      `Client can't deposit more than 25% his total of jobs to pay. Maximum deposit allowed: ${maxDeposit}`,
      400
    );
  }
}

module.exports = { NoJobsToPay, MaximumDepositExceeded };
