import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

export const TodoSetSchema = RecordingBaseSchema.omit({
  subscription_url: true,
  comments_count: true,
  comments_url: true,
}).extend({
  completed: z.boolean(),
  completed_ratio: z.string(),
  name: z.string(),
  todolists_count: z.number().int().nonnegative(),
  todolists_url: z.string().url(),
  app_todoslists_url: z.string().url(),
});

export type TodoSet = z.infer<typeof TodoSetSchema>;
