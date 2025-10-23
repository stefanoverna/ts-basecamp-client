import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

export const InboxSchema = RecordingBaseSchema.extend({
  type: z.literal('Inbox'),
  forwards_count: z.number().int().nonnegative().optional(),
  forwards_url: z.string().url().optional(),
});

export type Inbox = z.infer<typeof InboxSchema>;
