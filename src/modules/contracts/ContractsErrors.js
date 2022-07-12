const BaseError = require('../../shared/BaseError');

class NonTerminatedContractsNotFound extends BaseError {
  constructor(profileId) {
    super(`No non terminated contracts found for profile id ${profileId}`, 404);
  }
}

class ContractNotFound extends BaseError {
  constructor(id, profileId) {
    super(`Contract ${id} wasn't found for profile id ${profileId}`, 404);
  }
}

module.exports = {
  NonTerminatedContractsNotFound,
  ContractNotFound,
};
