import { pick } from 'lodash';
import type { z } from 'zod';

import { NewSubjectDtoSchema } from 'backend/dtos/subject.dto';
import type { SubjectModel } from 'models/subject.model';
import type { DialogActionMode } from 'types/common';

export const subjectFormSchema = NewSubjectDtoSchema;
export type SubjectFormikValues = z.infer<typeof subjectFormSchema>;

export const newSubjectFormInitialValues: SubjectFormikValues = {
  name: '',
  description: '',
};

export const getSubjectFormInitialValues = (
  mode: DialogActionMode,
  subject?: SubjectModel,
): SubjectFormikValues => {
  if (mode === 'add' || !subject) return newSubjectFormInitialValues;

  const values = pick(subject, ['name', 'description']);

  return values;
};
