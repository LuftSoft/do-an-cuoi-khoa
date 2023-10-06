export class UnauthorizedError extends Error {
  public readonly name = 'UnauthorizedError';

  constructor(message: string) {
    super(message);

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class IncorrectOldPasswordError extends Error {
  public readonly name = 'IncorrectOldPassword';

  constructor(message: string) {
    super(message);

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SamePasswordsError extends Error {
  public readonly name = 'SamePasswordError';

  constructor(message: string) {
    super(message);

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidResetPasswordTokenError extends Error {
  public readonly name = 'InvalidResetPasswordTokenError';

  constructor(message: string) {
    super(message);

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
