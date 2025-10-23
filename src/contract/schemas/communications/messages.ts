import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  HtmlStringSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

export const MessageCoreSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  inherits_status: z.boolean(),
  type: z.string(),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url().optional(),
  subscription_url: z.string().url().optional(),
  comments_count: z.number().int().nonnegative().optional(),
  comments_url: z.string().url().optional(),
  parent: RecordingRefSchema.optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const MessageSummarySchema = MessageCoreSchema.extend({
  title: z.string(),
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
