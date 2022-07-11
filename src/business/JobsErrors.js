const BaseError = require('../util/BaseError');

class JobIsAlreadyPaid extends BaseError {
  constructor(id) {
    super(`Job ${id} is already paid`, 409);
  }
}

class JobNotFound extends BaseError {
  constructor(jobId, clientId) {
    super(`Job ${jobId} wasn't for client ${clientId}`, 404);
  }
}

class NotEnoughFunds extends BaseError {
  constructor(jobId, clientId) {
    super(`Client ${clientId} don't have enough funds to pay job ${jobId}`, 409);
  }
}

module.exports = { JobIsAlreadyPaid, JobNotFound, NotEnoughFunds };
