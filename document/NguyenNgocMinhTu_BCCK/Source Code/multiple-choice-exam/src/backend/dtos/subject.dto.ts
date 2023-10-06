import type { z } from 'zod';

import { SubjectSchema } from 'models/subject.model';
import type { Id } from 'types/common';

export const NewSubjectDtoSchema = SubjectSchema.pick({
  name: true,
  description: true,
});

export const UpdateSubjectDtoSchema = NewSubjectDtoSchema.partial();

export type NewSubjectDto = z.infer<typeof NewSubjectDtoSchema>;
export type UpdateSubjectDto = z.infer<typeof UpdateSubjectDtoSchema>;
export type UpdateSubjectWithIdDto = z.infer<typeof UpdateSubjectDtoSchema> &
  Id;
