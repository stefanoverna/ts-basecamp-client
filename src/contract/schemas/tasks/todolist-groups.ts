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
