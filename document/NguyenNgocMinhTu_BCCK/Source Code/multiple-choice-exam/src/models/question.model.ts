import { z } from 'zod';

import { AbstractSchema } from './abstract.model';
import type { LecturerModel } from './lecturer.model';
import type { SubjectModel } from './subject.model';

import { Difficulty, Option } from 'backend/enums/question.enum';

export const QuestionSchema = AbstractSchema.extend({
  id: z.string().uuid(),
  imageUrl: z.string().optional().nullable(),
  content: z
    .string({
      required_error: 'Vui lòng nhập nội dung câu hỏi',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(500),
  optionA: z
    .string({
      required_error: 'Vui lòng nhập nội dung câu A',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(250),
  optionB: z
    .string({
      required_error: 'Vui lòng nhập nội dung câu B',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(250),
  optionC: z
    .string({
      required_error: 'Vui lòng nhập nội dung câu C',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(250),
  optionD: z
    .string({
      required_error: 'Vui lòng nhập nội dung câu D',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(250),
  correctOption: z.nativeEnum(Option),
  difficulty: z.nativeEnum(Difficulty),

  subject: z
    .string({
      required_error: 'Vui lòng chọn môn học',
    })
    .uuid(),
  lecturer: z.string().uuid(),
  testQuestions: z.array(z.string().uuid()).optional(),
});

export type QuestionModel = z.infer<typeof QuestionSchema> & {
  canDelete: boolean;
};
type ReferenceKeys = keyof Pick<QuestionModel, 'lecturer' | 'subject'>;

type PopulatedField<K extends keyof QuestionModel> = K extends 'subject'
  ? SubjectModel
  : K extends 'lecturer'
  ? LecturerModel
  : never;

type PopulatedQuestionModel<K extends ReferenceKeys> = Omit<
  QuestionModel,
  K
> & {
  [P in K]: PopulatedField<P>;
};

export type FullyPopulatedQuestionModel = PopulatedQuestionModel<
  'lecturer' | 'subject'
>;
