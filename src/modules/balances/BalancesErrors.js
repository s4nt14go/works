const BaseError = require('../../shared/BaseError');

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

class DepositNotAnumber extends BaseError {
  constructor(deposit) {
    super(`Deposit isn't a number: ${deposit}`, 400);
  }
}

class NoClientFound extends BaseError {
  constructor(id) {
    super(`No client found with id: ${id}`, 401);
  }
}

module.exports = {
  NoJobsToPay,
  MaximumDepositExceeded,
  DepositNotAnumber,
  NoClientFound,
};
