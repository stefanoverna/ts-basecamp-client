import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

export const ForwardSchema = RecordingBaseSchema.extend({
  type: z.literal('Inbox::Forward'),
  content: z.string(),
  subject: z.string(),
  from: z.string().nullable().optional(),
  replies_count: z.number().int().nonnegative(),
  replies_url: z.string().url(),
});

export const ForwardListResponseSchema = z.array(ForwardSchema);

export const ForwardListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type Forward = z.infer<typeof ForwardSchema>;
export type ForwardListQuery = z.infer<typeof ForwardListQuerySchema>;
