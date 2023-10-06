export class UnauthorizedLecturerError extends Error {
  public readonly name = 'UnauthorizedLecturerError';

  constructor(message: string) {
    super(message);

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
