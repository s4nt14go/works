const { AppError } = require('./AppErrors');

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
      await this.fail(new AppError());
    }
  }

  async ok(result) {
    if (this.transaction) await this.transaction.commit();
    this.res.json({
      ...result,
      time: new Date().toJSON(),
    });
  }

  async fail(error) {
    if (this.transaction) await this.transaction.rollback();
    const { httpStatus, message, type, time } = error;
    this.res
      .status(httpStatus)
      .send({
        message,
        errorType: type,
        time,
      })
      .end();
  }
}

module.exports = BaseController;
