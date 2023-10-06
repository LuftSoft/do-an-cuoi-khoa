import { z } from 'zod';

export const AbstractSchema = z.object({
  id: z.string().uuid(),
  active: z.boolean(),
});

export type AbstractModel = z.infer<typeof AbstractSchema>;
