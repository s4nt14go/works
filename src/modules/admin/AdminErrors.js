const BaseError = require('../../shared/BaseError');

class JobsNotFound extends BaseError {
  constructor(startDate, endDate) {
    super(`No paid jobs found between ${startDate} and ${endDate}`, 404);
  }
}

module.exports = {
  JobsNotFound,
};
