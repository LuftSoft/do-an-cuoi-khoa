import { QuestionEntity } from 'backend/entities/question.entity';
import type { SubjectEntity } from 'backend/entities/subject.entity';
import { getRepo } from 'backend/utils/database.helper';

export class SubjectService {
  public static async getCanDelete(subjectId: string): Promise<boolean> {
    const questionRepo = await getRepo(QuestionEntity);
    const count = await questionRepo.count({ subject: { id: subjectId } });
    const subjectHasNoQuestion = count === 0;

    return subjectHasNoQuestion;
  }

  public static async addCanDeleteField(subjects: SubjectEntity[]) {
    const promises = subjects.map(async (element) => ({
      ...element,
      canDelete: await SubjectService.getCanDelete(element.id),
    }));
    const finalData = await Promise.all(promises);

    return finalData;
  }
}
