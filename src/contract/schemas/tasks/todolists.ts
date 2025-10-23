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

const TodoListBaseSchema = TodoRecordingCoreSchema.extend({
  description: HtmlStringSchema.optional(),
  completed: z.boolean(),
  completed_ratio: z.string(),
  name: z.string(),
  todos_url: z.string().url(),
  app_todos_url: z.string().url(),
});

export const TodoTopLevelListSchema = TodoListBaseSchema.extend({
  groups_url: z.string().url(),
});

export const TodoListGroupSchema = TodoListBaseSchema.extend({
  group_position_url: z.string().url(),
});

export const TodoListSchema = z.union([TodoTopLevelListSchema, TodoListGroupSchema]);

export const TodoListsResponseSchema = z.array(TodoTopLevelListSchema);

export const TodoListQuerySchema = z.object({
  status: z.enum(['active', 'archived', 'trashed']).or(z.string()).optional(),
  page: z.coerce.number().int().positive().optional(),
});

export const TodoListCreateBodySchema = z.object({
  name: z.string().min(1),
  description: HtmlStringSchema.nullable().optional(),
});

export const TodoListUpdateBodySchema = z.object({
  name: z.string().min(1),
  description: HtmlStringSchema.nullable().optional(),
});

export type TodoList = z.infer<typeof TodoListSchema>;
export type TodoTopLevelList = z.infer<typeof TodoTopLevelListSchema>;
export type TodoListsResponse = z.infer<typeof TodoListsResponseSchema>;
export type TodoListQuery = z.infer<typeof TodoListQuerySchema>;
export type TodoListCreateBody = z.infer<typeof TodoListCreateBodySchema>;
export type TodoListUpdateBody = z.infer<typeof TodoListUpdateBodySchema>;
