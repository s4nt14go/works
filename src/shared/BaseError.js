class BaseError {
  constructor(message, httpStatus) {
    this.type = this.constructor.name;
    this.message = message;
    this.httpStatus = httpStatus;
  }
}

module.exports = BaseError;
