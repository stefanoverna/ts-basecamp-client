import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

export const InboxReplySchema = RecordingBaseSchema.extend({
  type: z.literal('Inbox::Reply'),
  content: HtmlStringSchema,
});

export const InboxReplyListResponseSchema = z.array(InboxReplySchema);

export const InboxReplyListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type InboxReply = z.infer<typeof InboxReplySchema>;
