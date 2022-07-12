const BaseError = require('./BaseError');

class AppError extends BaseError {
  constructor() {
    super(`Unexpected error`, 500);
  }
}

module.exports = {
  AppError,
};
