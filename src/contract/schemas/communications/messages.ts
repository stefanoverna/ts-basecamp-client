import { z } from 'zod';

import { BasecampIdSchema, HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

export const MessageSummarySchema = RecordingBaseSchema.extend({
  type: z.literal('Message'),
  content: HtmlStringSchema.optional(),
});

export const MessageSchema = MessageSummarySchema.extend({
  subject: z.string(),
});

export const MessageListResponseSchema = z.array(MessageSummarySchema);

export const MessageListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const MessageCreateBodySchema = z.object({
  subject: z.string().min(1),
  status: z.enum(['active', 'draft']).or(z.string()),
  content: HtmlStringSchema.optional(),
  category_id: BasecampIdSchema.optional(),
  subscriptions: z.array(BasecampIdSchema).optional(),
});

export const MessageUpdateBodySchema = z
  .object({
    subject: z.string().min(1).optional(),
    content: HtmlStringSchema.optional(),
    category_id: BasecampIdSchema.optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one field must be provided to update a message.',
  );

export type Message = z.infer<typeof MessageSchema>;
export type MessageSummary = z.infer<typeof MessageSummarySchema>;
export type MessageListQuery = z.infer<typeof MessageListQuerySchema>;
export type MessageCreateBody = z.infer<typeof MessageCreateBodySchema>;
export type MessageUpdateBody = z.infer<typeof MessageUpdateBodySchema>;
