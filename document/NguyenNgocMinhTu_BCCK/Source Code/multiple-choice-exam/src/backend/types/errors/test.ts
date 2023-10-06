import type { Difficulty } from 'backend/enums/question.enum';

export class InvalidPortionError extends Error {
  public readonly name = 'InvalidPortionError';

  constructor(message: string) {
    super(message);

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotEnoughQuestionError extends Error {
  public readonly name = 'NotEnoughQuestion';
  public readonly difficulty: Difficulty;
  public readonly missing: number;

  constructor(message: string, difficulty: Difficulty, missing: number) {
    super(message);
    this.difficulty = difficulty;
    this.missing = missing;

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TestExpiredError extends Error {
  public readonly name = 'TestExpiredError';

  constructor(message: string) {
    super(message);

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
