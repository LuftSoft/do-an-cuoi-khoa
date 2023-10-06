import { z } from 'zod';

import { AbstractSchema } from './abstract.model';

const LecturerSchema = AbstractSchema.extend({
  degree: z
    .string()
    .min(1, {
      message: 'Phải ít nhất chứa 1 ký tự',
    })
    .max(100),

  account: z.string().uuid().optional(),
  tests: z.array(z.string().uuid()).optional(),
  questions: z.array(z.string().uuid()).optional(),
});

export type LecturerModel = z.infer<typeof LecturerSchema>;
