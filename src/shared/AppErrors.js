const BaseError = require('./BaseError');

class AppError extends BaseError {
  constructor() {
    super(`Unexpected error`, 500);
  }
}

class NoClientFound extends BaseError {
  constructor(id) {
    super(`No client found with id: ${id}`, 401);
  }
}

module.exports = {
  AppError,
  NoClientFound,
};
