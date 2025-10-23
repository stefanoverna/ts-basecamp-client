import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

export const ClientReplySchema = RecordingBaseSchema.extend({
  type: z.literal('Client::Reply'),
  content: HtmlStringSchema,
});

export const ClientReplyListResponseSchema = z.array(ClientReplySchema);

export const ClientReplyListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type ClientReply = z.infer<typeof ClientReplySchema>;
