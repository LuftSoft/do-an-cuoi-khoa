import type { DeepPartial } from 'typeorm';

import { CommonService } from './common.service';

import { QuestionEntity } from 'backend/entities/question.entity';
import { TestQuestionEntity } from 'backend/entities/testQuestion.entity';
import type { PaginationParams } from 'backend/types/pagination';
import { getRepo } from 'backend/utils/database.helper';

type GetQuestionsWithActiveSubjectsInputs = {
  subjectIds: string[];
  paginationParams: PaginationParams;
  contentKeyword?: string;
  simpleFilters?: DeepPartial<QuestionEntity>;
};

export class QuestionService {
  public static async getQuestionsWithActiveSubjects(
    inputs: GetQuestionsWithActiveSubjectsInputs,
  ): Promise<[QuestionEntity[], number]> {
    const { subjectIds, paginationParams, contentKeyword, simpleFilters } =
      inputs;
    const { page, limit } = paginationParams;

    const questionRepo = await getRepo(QuestionEntity);

    const query = questionRepo
      .createQueryBuilder('question')
      .innerJoinAndSelect(
        'question.subject',
        'subject',
        'subject.active = :active',
        { active: true },
      )
      .innerJoinAndSelect('question.lecturer', 'lecturer')
      .orderBy('question.createdAt', 'DESC');

    if (simpleFilters) {
      query.where(simpleFilters);
    }

    if (subjectIds && subjectIds.length > 0) {
      query.andWhere('subject.id IN (:...subjectIds)', { subjectIds });
    }

    if (contentKeyword) {
      query.andWhere('question.content ILIKE :content', {
        content: `%${contentKeyword}%`,
      });
    }

    if (!contentKeyword) {
      query.skip((page - 1) * limit);
    }

    const [questions, total] = await query.take(limit).getManyAndCount();

    return [questions, total];
  }
  public static async checkEditPermission(
    questionId: string,
    lecturerId: string,
  ): Promise<boolean> {
    const question = await CommonService.getRecord({
      entity: QuestionEntity,
      filter: {
        id: questionId,
      },
      relations: ['lecturer'],
    });

    return question?.lecturer?.id === lecturerId;
  }

  public static async getCanDelete(questionId: string): Promise<boolean> {
    const testQuestionRepo = await getRepo(TestQuestionEntity);
    const count = await testQuestionRepo.count({
      question: { id: questionId },
    });
    const questionHasNoTestQuestion = count === 0;

    return questionHasNoTestQuestion;
  }

  public static async addCanDeleteField(questions: QuestionEntity[]) {
    const promises = questions.map(async (element) => ({
      ...element,
      canDelete: await QuestionService.getCanDelete(element.id),
    }));
    const finalData = await Promise.all(promises);

    return finalData;
  }
}
