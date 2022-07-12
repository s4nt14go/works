const BaseError = require('../../shared/BaseError');

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

class ClientNotFound extends BaseError {
  constructor(id) {
    super(`There is no client with id: ${id}`, 404);
  }
}

class JobIdNotAnumber extends BaseError {
  constructor(id) {
    super(`Job id received isn't a number: ${id}`, 400);
  }
}

module.exports = {
  JobIsAlreadyPaid,
  JobNotFound,
  NotEnoughFunds,
  ClientNotFound,
  JobIdNotAnumber,
};
