import type { TestModel } from 'models/test.model';
import { TestSchema } from 'models/test.model';

export const justTestingDtoSchema = TestSchema.omit({
  id: true,
  testQuestions: true,
});

export type JustTestingDto = Omit<TestModel, 'id' | 'testQuestions'>;
