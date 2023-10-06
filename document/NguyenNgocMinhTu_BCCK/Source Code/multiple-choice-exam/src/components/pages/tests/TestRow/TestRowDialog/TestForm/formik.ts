import { addDays, setHours, startOfDay } from 'date-fns';
import { omit } from 'lodash';
import type { z } from 'zod';

import { NewTestDtoSchema } from 'backend/dtos/test.dto';
import { SubjectDropdownSchema } from 'models/subject.model';
import type { TestWithLecturerAndSubjectModel } from 'models/test.model';
import type { DialogActionMode } from 'types/common';
import { getStringToNumberSchema } from 'utils/schema.helper';

export const testFormSchema = NewTestDtoSchema.omit({
  subject: true,
  numberOfQuestions: true,
  durationMinutes: true,
  easyPortion: true,
  normalPortion: true,
  hardPortion: true,
}).extend({
  subject: SubjectDropdownSchema,
  numberOfQuestions: getStringToNumberSchema('số câu hỏi', 5, 100),
  durationMinutes: getStringToNumberSchema('thời gian', 5, 180),
  easyPortion: getStringToNumberSchema('tỉ lệ câu dễ', 0, 100),
  normalPortion: getStringToNumberSchema('tỉ lệ câu trung bình', 0, 100),
  hardPortion: getStringToNumberSchema('tỉ lệ câu khó', 0, 100),
});
export type TestFormikValues = z.infer<typeof testFormSchema>;

export const newTestFormInitialValues: TestFormikValues = {
  durationMinutes: '',
  numberOfQuestions: '',
  testDate: setHours(startOfDay(addDays(new Date(), 1)), 9),
  title: '',
  subject: undefined as any,
  lecturer: '',
  easyPortion: '',
  normalPortion: '',
  hardPortion: '',
};

export const getTestFormInitialValues = (
  mode: DialogActionMode,
  test?: TestWithLecturerAndSubjectModel,
): TestFormikValues => {
  if (mode === 'add' || !test) return newTestFormInitialValues;

  const omittedObject = omit(test, ['testQuestions']);
  const values: TestFormikValues = {
    ...omittedObject,
    durationMinutes: omittedObject.durationMinutes.toString(),
    numberOfQuestions: omittedObject.numberOfQuestions.toString(),
    easyPortion: omittedObject.easyPortion.toString(),
    normalPortion: omittedObject.normalPortion.toString(),
    hardPortion: omittedObject.hardPortion.toString(),
    lecturer: omittedObject.lecturer.id,
  };

  return values;
};
