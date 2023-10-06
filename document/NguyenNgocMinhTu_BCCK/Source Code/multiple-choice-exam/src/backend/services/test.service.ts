import type { Repository } from 'typeorm';
import { getManager } from 'typeorm';

import { CommonService } from './common.service';

import { QuestionEntity } from 'backend/entities/question.entity';
import { TestEntity } from 'backend/entities/test.entity';
import { TestQuestionEntity } from 'backend/entities/testQuestion.entity';
import type { Option } from 'backend/enums/question.enum';
import { Difficulty } from 'backend/enums/question.enum';
import { RecordNotFoundError } from 'backend/types/errors/common';
import { NotEnoughQuestionError } from 'backend/types/errors/test';
import type { Portions } from 'backend/types/service';
import { getRepo } from 'backend/utils/database.helper';
import { getIsTestDateValidToEdit } from 'components/pages/tests/helpers';
import type { QuestionModel } from 'models/question.model';
import type {
  TestForExamModel,
  TestWithLecturerAndSubjectModel,
} from 'models/test.model';
import type {
  FullyPopulatedTestQuestionModel,
  TestQuestionForExamModel,
} from 'models/testQuestion.model';
import type { ExamResult } from 'types/common';

export class TestService {
  private static _calculatePortions(test: TestEntity): Portions {
    const totalQuestions = test.numberOfQuestions;

    // Calculate exact proportions without rounding
    const exactEasyQuestions = (test.easyPortion / 100) * totalQuestions;
    const exactNormalQuestions = (test.normalPortion / 100) * totalQuestions;

    // Initially round easy and normal counts
    let easyQuestionsCount = Math.round(exactEasyQuestions);
    let normalQuestionsCount = Math.round(exactNormalQuestions);

    // Adjust if both rounded up or both rounded down
    const combinedRounded = easyQuestionsCount + normalQuestionsCount;
    if (combinedRounded > totalQuestions) {
      // Both rounded up
      if (exactEasyQuestions > exactNormalQuestions) {
        easyQuestionsCount--;
      } else {
        normalQuestionsCount--;
      }
    } else if (combinedRounded < totalQuestions) {
      // Both rounded down
      if (exactEasyQuestions > exactNormalQuestions) {
        easyQuestionsCount++;
      } else {
        normalQuestionsCount++;
      }
    }

    // Calculate hard questions based on total - the other two
    const hardQuestionsCount =
      totalQuestions - easyQuestionsCount - normalQuestionsCount;

    return {
      easy: easyQuestionsCount,
      normal: normalQuestionsCount,
      hard: hardQuestionsCount,
    };
  }

  private static async _validateQuestionsAvailability(
    test: TestEntity,
    portions: Portions,
    questionRepo: Repository<QuestionEntity>,
  ) {
    // Ensure there are enough questions for each difficulty
    const [
      easyQuestionsAvailable,
      normalQuestionsAvailable,
      hardQuestionsAvailable,
    ] = await Promise.all([
      questionRepo.count({
        where: { difficulty: Difficulty.EASY, subject: test.subject },
      }),
      questionRepo.count({
        where: { difficulty: Difficulty.NORMAL, subject: test.subject },
      }),
      questionRepo.count({
        where: { difficulty: Difficulty.HARD, subject: test.subject },
      }),
    ]);

    if (portions.easy > easyQuestionsAvailable)
      throw new NotEnoughQuestionError(
        'Not enough easy questions',
        Difficulty.EASY,
        portions.easy - easyQuestionsAvailable,
      );
    if (portions.normal > normalQuestionsAvailable)
      throw new NotEnoughQuestionError(
        'Not enough normal questions',
        Difficulty.NORMAL,
        portions.normal - normalQuestionsAvailable,
      );
    if (portions.hard > hardQuestionsAvailable)
      throw new NotEnoughQuestionError(
        'Not enough hard questions',
        Difficulty.HARD,
        portions.hard - hardQuestionsAvailable,
      );
  }

  private static async _fetchQuestionsByDifficulty(
    test: TestEntity,
    portions: Portions,
    questionRepo: Repository<QuestionEntity>,
  ) {
    let easyQuestions: QuestionEntity[] = [],
      normalQuestions: QuestionEntity[] = [],
      hardQuestions: QuestionEntity[] = [];

    if (portions.easy > 0) {
      easyQuestions = await questionRepo
        .createQueryBuilder('question')
        .where('question.difficulty = :difficulty', {
          difficulty: Difficulty.EASY,
        })
        .andWhere('question.subject_id = :subjectId', {
          subjectId: test.subject.id,
        })
        .andWhere('question.active = true')
        .orderBy('RANDOM()')
        .limit(portions.easy)
        .getMany();
    }

    if (portions.normal > 0) {
      normalQuestions = await questionRepo
        .createQueryBuilder('question')
        .where('question.difficulty = :difficulty', {
          difficulty: Difficulty.NORMAL,
        })
        .andWhere('question.subject_id = :subjectId', {
          subjectId: test.subject.id,
        })
        .andWhere('question.active = true')
        .orderBy('RANDOM()')
        .limit(portions.normal)
        .getMany();
    }

    if (portions.hard > 0) {
      hardQuestions = await questionRepo
        .createQueryBuilder('question')
        .where('question.difficulty = :difficulty', {
          difficulty: Difficulty.HARD,
        })
        .andWhere('question.subject_id = :subjectId', {
          subjectId: test.subject.id,
        })
        .andWhere('question.active = true')
        .orderBy('RANDOM()')
        .limit(portions.hard)
        .getMany();
    }

    return [
      ...easyQuestions,
      ...normalQuestions,
      ...hardQuestions,
    ] as QuestionEntity[];
  }

  private static async _insertTestQuestions(
    test: TestEntity,
    questions: QuestionEntity[],
  ) {
    // Start a transaction and create TestQuestionEntity records
    await getManager().transaction(async (transactionalEntityManager) => {
      for (let i = 0; i < questions.length; i++) {
        const testQuestion = new TestQuestionEntity();
        testQuestion.order = i + 1; // order starts from 1
        testQuestion.test = test;
        testQuestion.question = questions[i];

        await transactionalEntityManager.save(testQuestion);
      }
    });
  }

  public static async cleanupOldTestQuestions(testId: string) {
    const testQuestionRepo = await getRepo(TestQuestionEntity);
    const testQuestions = await testQuestionRepo.find({
      where: { test: testId },
    });
    await testQuestionRepo.remove(testQuestions);
  }

  public static async composeTestQuestions(testId: string) {
    const testRepo = await getRepo(TestEntity);
    const questionRepo = await getRepo(QuestionEntity);

    const test = await testRepo.findOne(testId, {
      relations: ['subject', 'lecturer'],
    });
    if (!test) {
      throw new RecordNotFoundError(
        `Entity ${TestEntity.name} with id ${testId} not found`,
      );
    }

    const portions = this._calculatePortions(test);
    await this._validateQuestionsAvailability(test, portions, questionRepo);
    const questions = await this._fetchQuestionsByDifficulty(
      test,
      portions,
      questionRepo,
    );
    await this._insertTestQuestions(test, questions);
    return questions;
  }

  public static async checkEditPermission(testId: string) {
    const test = await CommonService.getRecord({
      entity: TestEntity,
      filter: {
        id: testId,
      },
    });
    if (!test)
      throw new RecordNotFoundError(
        `Entity ${TestEntity.name} with id ${testId} not found`,
      );

    return getIsTestDateValidToEdit(test.testDate);
  }

  private static async _getAreTestQuestionsValid(testId: string) {
    const testRepo = await getRepo(TestEntity);
    const testQuestionRepo = await getRepo(TestQuestionEntity);

    const test = await testRepo.findOne(testId);

    if (!test) {
      throw new RecordNotFoundError(
        `Entity ${TestEntity.name} with id ${testId} not found`,
      );
    }

    const testQuestions = await testQuestionRepo.find({
      where: { test: testId },
      relations: ['question'], // ensure to load the related question data
    });

    // count the difficulty levels
    const difficultyCounts = {
      [Difficulty.EASY]: 0,
      [Difficulty.NORMAL]: 0,
      [Difficulty.HARD]: 0,
    };

    testQuestions.forEach((question) => {
      difficultyCounts[question.question.difficulty]++;
    });

    // calculate the required number of each type of questions
    const requiredCounts = this._calculatePortions(test);

    // check if the portions are valid
    const areQuestionPortionsValid =
      difficultyCounts[Difficulty.EASY] === requiredCounts.easy &&
      difficultyCounts[Difficulty.NORMAL] === requiredCounts.normal &&
      difficultyCounts[Difficulty.HARD] === requiredCounts.hard;

    return areQuestionPortionsValid;
  }

  public static async addAreTestQuestionsValidField(tests: TestEntity[]) {
    const promises = tests.map(async (element) => ({
      ...element,
      areTestQuestionsValid: await this._getAreTestQuestionsValid(element.id),
    }));
    const finalData = await Promise.all(promises);

    return finalData;
  }

  public static async getCanPerformMockTest(testId: string) {
    const areTestQuestionsValid = await this._getAreTestQuestionsValid(testId);
    return areTestQuestionsValid;
  }

  private static async _getFullyPopulatedTestQuestions(
    testId: string,
  ): Promise<FullyPopulatedTestQuestionModel[]> {
    const testRepo = await getRepo(TestEntity);
    const testQuestionRepo = await getRepo(TestQuestionEntity);
    const questionRepo = await getRepo(QuestionEntity);

    const test = await testRepo.findOne(testId, {
      relations: ['lecturer', 'subject'],
    });

    if (!test) {
      throw new RecordNotFoundError(
        `Entity ${TestEntity.name} with id ${testId} not found`,
      );
    }

    const testQuestions = await testQuestionRepo.find({
      where: { test },
      order: {
        order: 'ASC',
      },
    });

    const testQuestionsForExam: FullyPopulatedTestQuestionModel[] = [];

    for (const testQuestion of testQuestions) {
      const question = await questionRepo.findOne({
        where: { id: testQuestion.questionId },
      });

      if (!question) {
        throw new Error(
          `Question with id ${testQuestion.question.id} not found`,
        );
      }

      const testQuestionForExam: FullyPopulatedTestQuestionModel = {
        ...(question as unknown as QuestionModel),
        order: testQuestion.order,
      };

      testQuestionsForExam.push(testQuestionForExam);
    }

    return testQuestionsForExam;
  }

  private static async _getTestQuestionsForExam(
    testId: string,
  ): Promise<TestQuestionForExamModel[]> {
    const fullyPopulatedTestQuestions =
      await this._getFullyPopulatedTestQuestions(testId);

    const testQuestionsForExam = fullyPopulatedTestQuestions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ correctOption, ...rest }) => rest,
    );

    return testQuestionsForExam;
  }

  public static async getTestForExam(
    testId: string,
  ): Promise<TestForExamModel> {
    const test = (await CommonService.getRecord({
      entity: TestEntity,
      filter: {
        id: testId,
      },
      relations: ['lecturer', 'testQuestions'],
    })) as unknown as TestWithLecturerAndSubjectModel;

    const testQuestionsForExam = await this._getTestQuestionsForExam(testId);

    const testForExam: TestForExamModel = {
      ...test,
      testQuestions: testQuestionsForExam,
    };

    return testForExam;
  }

  public static async gradeMockTest(
    testId: string,
    answers: (Option | undefined)[],
  ): Promise<ExamResult> {
    const testQuestions = await this._getFullyPopulatedTestQuestions(testId);
    let totalCorrectAnswer = 0;

    answers.forEach((answer, index) => {
      if (answer === testQuestions[index].correctOption) totalCorrectAnswer++;
    });

    const numberOfQuestions = testQuestions.length;
    const grade = (totalCorrectAnswer / numberOfQuestions) * 10;
    const roundedGrade = Math.round(grade * 4) / 4;
    return {
      correctOptions: testQuestions.map((question) => question.correctOption),
      totalCorrectAnswer,
      grade: roundedGrade,
    };
  }
}
