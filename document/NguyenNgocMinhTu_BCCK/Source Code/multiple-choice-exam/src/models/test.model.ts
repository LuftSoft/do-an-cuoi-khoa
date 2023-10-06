import { z } from 'zod';

import { AbstractSchema } from './abstract.model';
import type { LecturerModel } from './lecturer.model';
import type { SubjectModel } from './subject.model';
import type { TestQuestionForExamModel } from './testQuestion.model';

import { isAfterNineAMTomorrow } from 'utils/date.helper';

export const TestSchema = AbstractSchema.extend({
  numberOfQuestions: z
    .number({
      required_error: 'Vui lòng nhập số câu hỏi',
    })
    .int()
    .min(5)
    .max(100),
  durationMinutes: z
    .number({
      required_error: 'Vui lòng nhập thời gian',
    })
    .int()
    .min(5)
    .max(180),
  testDate: z
    .date()
    .refine((date) => isAfterNineAMTomorrow(date), {
      message: 'Ngày thi sớm nhất phải là 9 giờ sáng mai',
    })
    .or(
      z.string().refine((stringAsDate) => isAfterNineAMTomorrow(stringAsDate), {
        message: 'Ngày thi sớm nhất phải là 9 giờ sáng mai',
      }),
    ),
  title: z
    .string({
      required_error: 'Vui lòng nhập tiêu đề',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(100),

  easyPortion: z
    .number({
      required_error: 'Vui lòng nhập tỉ lệ câu dễ',
    })
    .int()
    .min(0)
    .max(100),
  normalPortion: z
    .number({
      required_error: 'Vui lòng nhập tỉ lệ câu trung bình',
    })
    .int()
    .min(0)
    .max(100),
  hardPortion: z
    .number({
      required_error: 'Vui lòng nhập tỉ lệ câu khó',
    })
    .int()
    .min(0)
    .max(100),

  lecturer: z.string().uuid(),
  subject: z.string().uuid(),
  testQuestions: z.array(z.string().uuid()).optional(),
});

export type TestModel = z.infer<typeof TestSchema> & {
  areTestQuestionsValid: boolean;
};
type ReferenceKeys = keyof Pick<TestModel, 'lecturer' | 'subject'>;

type PopulatedField<K extends keyof TestModel> = K extends 'subject'
  ? SubjectModel
  : K extends 'lecturer'
  ? LecturerModel
  : // : K extends 'testQuestions'
    // ? TestQuestionForExamModel[]
    never;

type PopulatedTestModel<K extends ReferenceKeys> = Omit<TestModel, K> & {
  [P in K]: PopulatedField<P>;
};

export type TestWithLecturerAndSubjectModel = PopulatedTestModel<
  'lecturer' | 'subject'
>;

// technically fully populated, but with the correctOption omitted
export interface TestForExamModel
  extends Omit<PopulatedTestModel<'lecturer' | 'subject'>, 'testQuestions'> {
  testQuestions: TestQuestionForExamModel[];
}
