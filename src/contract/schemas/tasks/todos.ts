import { z } from 'zod';

import { BasecampIdSchema, HtmlStringSchema, IsoDateTimeSchema, PersonSummarySchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

const TodoCompletionSchema = z.object({
  created_at: IsoDateTimeSchema,
  creator: PersonSummarySchema,
});

export const TodoSchema = RecordingBaseSchema.extend({
  type: z.literal('Todo'),
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
  completed: z.enum(['true']).optional(),
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
