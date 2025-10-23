import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

const TodoListBaseSchema = RecordingBaseSchema.extend({
  type: z.literal('Todolist'),
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
