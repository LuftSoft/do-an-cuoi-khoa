import type { z } from 'zod';

import { TestSchema } from 'models/test.model';
import type { Id } from 'types/common';

export const NewTestDtoSchema = TestSchema.pick({
  title: true,
  subject: true,
  testDate: true,
  durationMinutes: true,
  numberOfQuestions: true,
  lecturer: true,
  easyPortion: true,
  normalPortion: true,
  hardPortion: true,
});

export const UpdateTestDtoSchema = NewTestDtoSchema.partial();

export type NewTestDto = z.infer<typeof NewTestDtoSchema>;
export type UpdateTestDto = z.infer<typeof UpdateTestDtoSchema>;

export type UpdateTestWithIdDto = z.infer<typeof UpdateTestDtoSchema> & Id;
