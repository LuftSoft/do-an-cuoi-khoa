import type { z } from 'zod';

import { QuestionSchema } from 'models/question.model';
import type { Id } from 'types/common';

export const NewQuestionDtoSchema = QuestionSchema.pick({
  content: true,
  optionA: true,
  optionB: true,
  optionC: true,
  optionD: true,
  correctOption: true,
  difficulty: true,
  subject: true,
  lecturer: true,
  imageUrl: true,
});

export const UpdateQuestionDtoSchema = NewQuestionDtoSchema.partial();

export type NewQuestionDto = z.infer<typeof NewQuestionDtoSchema>;
export type UpdateQuestionDto = z.infer<typeof UpdateQuestionDtoSchema>;
export type UpdateQuestionWithIdDto = z.infer<typeof UpdateQuestionDtoSchema> &
  Id;
