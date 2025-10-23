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

const TodoCompletionSchema = z.object({
  created_at: IsoDateTimeSchema,
  creator: PersonSummarySchema,
});

const TodoRecordingCoreSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.string(),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url().optional(),
  subscription_url: z.string().url().optional(),
  comments_count: z.number().int().nonnegative().optional(),
  comments_url: z.string().url().optional(),
  position: z.number().int().nonnegative().optional(),
  parent: RecordingRefSchema.optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const TodoSchema = TodoRecordingCoreSchema.extend({
  description: HtmlStringSchema.optional(),
  completed: z.boolean(),
  completion: TodoCompletionSchema.optional(),
  content: z.string(),
  starts_on: z.string().date().nullable().optional(),
  due_on: z.string().date().nullable().optional(),
  assignees: z.array(PersonSummarySchema),
  completion_subscribers: z.array(PersonSummarySchema),
  completion_url: z.string().url(),
});

export const TodoCollectionResponseSchema = z.array(TodoSchema);

export const TodoQuerySchema = z.object({
  status: z.enum(['active', 'archived', 'trashed']).or(z.string()).optional(),
  completed: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
});

export const TodoCreateBodySchema = z.object({
  content: z.string().min(1),
  description: HtmlStringSchema.nullable().optional(),
  assignee_ids: z.array(BasecampIdSchema).optional(),
  completion_subscriber_ids: z.array(BasecampIdSchema).optional(),
  notify: z.boolean().optional(),
  due_on: z.string().date().nullable().optional(),
  starts_on: z.string().date().nullable().optional(),
});

export const TodoUpdateBodySchema = z.object({
  content: z.string().min(1),
  description: HtmlStringSchema.nullable().optional(),
  assignee_ids: z.array(BasecampIdSchema).optional(),
  completion_subscriber_ids: z.array(BasecampIdSchema).optional(),
  notify: z.boolean().optional(),
  due_on: z.string().date().nullable().optional(),
  starts_on: z.string().date().nullable().optional(),
});

export const TodoRepositionBodySchema = z.object({
  position: z.number().int().gte(1),
});

export type Todo = z.infer<typeof TodoSchema>;
export type TodoCollectionResponse = z.infer<typeof TodoCollectionResponseSchema>;
export type TodoQuery = z.infer<typeof TodoQuerySchema>;
export type TodoCreateBody = z.infer<typeof TodoCreateBodySchema>;
export type TodoUpdateBody = z.infer<typeof TodoUpdateBodySchema>;
export type TodoRepositionBody = z.infer<typeof TodoRepositionBodySchema>;
