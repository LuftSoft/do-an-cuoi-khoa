import { z } from 'zod';

import { AbstractSchema } from './abstract.model';
import type { QuestionModel } from './question.model';

export const TestQuestionSchema = AbstractSchema.extend({
  order: z.number(),
  test: z.string().uuid(),
  question: z.string().uuid(),
});

export type TestQuestionModel = z.infer<typeof TestQuestionSchema>;

export type FullyPopulatedTestQuestionModel = QuestionModel & {
  order: number;
};

export type TestQuestionForExamModel = Omit<
  FullyPopulatedTestQuestionModel,
  'correctOption'
>;
