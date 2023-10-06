import { z } from 'zod';

import { AbstractSchema } from './abstract.model';

export const SubjectSchema = AbstractSchema.extend({
  id: z.string().uuid(),
  name: z
    .string({
      required_error: 'Vui lòng nhập tên môn học',
    })
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(100, {
      message: 'Tên môn học không quá 100 ký tự',
    }),
  description: z
    .string()
    .max(500, {
      message: 'Mô tả không quá 500 ký tự',
    })
    .optional(),

  questions: z.array(z.string().uuid()).optional(),
  tests: z.array(z.string().uuid()).optional(),
});

export const SubjectDropdownSchema = z.object(
  {
    id: SubjectSchema.shape.id,
    name: SubjectSchema.shape.name,
  },
  {
    required_error: 'Vui lòng chọn môn học',
  },
);

export type SubjectModel = z.infer<typeof SubjectSchema> & {
  canDelete: boolean;
};
export type SubjectDropdownModel = Pick<SubjectModel, 'id' | 'name'>;
