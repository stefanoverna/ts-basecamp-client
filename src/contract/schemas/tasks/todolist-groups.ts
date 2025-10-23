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

export const TodoListGroupSchema = TodoListBaseSchema.extend({
  group_position_url: z.string().url(),
});

export const TodoListSchema = TodoListGroupSchema;

export const TodoListGroupsResponseSchema = z.array(TodoListGroupSchema);

export const TodoListGroupQuerySchema = z.object({
  status: z.enum(['active', 'archived', 'trashed']).or(z.string()).optional(),
  page: z.coerce.number().int().positive().optional(),
});

export const TodoListGroupCreateBodySchema = z.object({
  name: z.string().min(1),
  color: z
    .enum([
      'white',
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'aqua',
      'purple',
      'gray',
      'pink',
      'brown',
    ])
    .or(z.string())
    .optional(),
});

export const TodoListGroupRepositionBodySchema = z.object({
  position: z.number().int().gte(1),
});

export type TodoListGroup = z.infer<typeof TodoListGroupSchema>;
export type TodoListGroupsResponse = z.infer<typeof TodoListGroupsResponseSchema>;
export type TodoListGroupQuery = z.infer<typeof TodoListGroupQuerySchema>;
export type TodoListGroupCreateBody = z.infer<typeof TodoListGroupCreateBodySchema>;
export type TodoListGroupRepositionBody = z.infer<typeof TodoListGroupRepositionBodySchema>;
