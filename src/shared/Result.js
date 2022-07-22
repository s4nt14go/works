class Result {
  isSuccess;
  isFailure;
  error;
  _value;

  constructor(isSuccess, error, value) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error'
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message'
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  get value() {
    if (!this.isSuccess) {
      console.log('this:', this);
      throw new Error("Can't get value when Result didn't succeeded.");
    }
    if (this._value === undefined) {
      console.log('this:', this);
      throw new Error(`Can't get value when Result._value is undefined.`);
    }
    return this._value;
  }

  static ok(value) {
    return new Result(true, null, value);
  }

  static fail(error) {
    return new Result(false, error);
  }
}

module.exports = Result;
