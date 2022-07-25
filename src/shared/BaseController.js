const { AppError } = require('./Errors');

class BaseController {
  constructor(req, res, transaction) {
    this.req = req;
    this.res = res;
    this.transaction = transaction;
  }

  executeImpl() {
    throw new Error(
      `executeImpl should be implemented in the concrete class extending BaseController`
    );
  }

  async execute() {
    try {
      await this.executeImpl(this.req, this.res);
    } catch (err) {
      if (this.transaction) await this.transaction.rollback();
      console.log(`An unexpected error occurred`, err);
      await this.serverError(new AppError());
    }
  }

  async ok(result) {
    if (this.transaction) await this.transaction.commit();
    this.res.json(result);
  }

  async fail(error) {
    if (this.transaction) await this.transaction.rollback();
    const { httpStatus, message, type } = error;
    this.res
      .status(httpStatus)
      .send({
        message,
        errorType: type,
      })
      .end();
  }

  async serverError(error) {
    if (this.transaction) await this.transaction.rollback();
    const { message, type } = error;
    this.res
      .status(500)
      .send({
        message,
        errorType: type,
        time: new Date().toJSON(),
      })
      .end();
  }
}

module.exports = BaseController;
