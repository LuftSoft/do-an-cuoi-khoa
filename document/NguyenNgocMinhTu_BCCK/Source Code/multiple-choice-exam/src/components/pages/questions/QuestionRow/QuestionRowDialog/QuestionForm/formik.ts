import { omit } from 'lodash';
import type { z } from 'zod';

import { NewQuestionDtoSchema } from 'backend/dtos/question.dto';
import { Option } from 'backend/enums/question.enum';
import {
  DIFFICULTY_OPTIONS,
  DifficultyOptionSchema,
} from 'constants/question.constants';
import type { FullyPopulatedQuestionModel } from 'models/question.model';
import { SubjectDropdownSchema } from 'models/subject.model';
import type { DialogActionMode } from 'types/common';

export const questionFormSchema = NewQuestionDtoSchema.omit({
  difficulty: true,
  subject: true,
}).extend({
  difficulty: DifficultyOptionSchema,
  // We could either use .shape or make it optional and pass in our custom validation
  // subject: SubjectSchema.pick({ id: true, name: true })
  //   .optional()
  //   .refine((data) => !!data, {
  //     message: 'subject is required for this question',
  //   }),
  subject: SubjectDropdownSchema,
});

export type QuestionFormikValues = z.infer<typeof questionFormSchema>;

export const newQuestionFormInitialValues: QuestionFormikValues = {
  content: '',
  correctOption: Option.A,
  difficulty: DIFFICULTY_OPTIONS[0], // easy
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  subject: undefined as any, // subject is required, but not from the start
  lecturer: '',
  imageUrl: '',
};

export const getQuestionFormInitialValues = (
  mode: DialogActionMode,
  question?: FullyPopulatedQuestionModel,
): QuestionFormikValues => {
  if (mode === 'add' || !question) return newQuestionFormInitialValues;

  const omittedObject = omit(question, ['testQuestions']);
  const difficulty = DIFFICULTY_OPTIONS.find(
    (option) => option.value === omittedObject.difficulty,
  );
  const values: QuestionFormikValues = {
    ...omittedObject,
    lecturer: omittedObject.lecturer.id,
    difficulty: difficulty || DIFFICULTY_OPTIONS[0],
  };

  return values;
};
