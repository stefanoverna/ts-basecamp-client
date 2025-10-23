import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  TodoListGroupCreateBodySchema,
  TodoListGroupQuerySchema,
  TodoListGroupRepositionBodySchema,
  TodoListGroupsResponseSchema,
  TodoListSchema,
} from '../../schemas/tasks/todolist-groups';

const bucketPathParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndTodoListPathParams = bucketPathParams.extend({
  todolistId: BasecampIdParamSchema,
});

const bucketAndGroupPathParams = bucketPathParams.extend({
  groupId: BasecampIdParamSchema,
});

export const todoListGroupsRouter = c.router({
  list: {
    summary: 'List to-do list groups',
    description:
      'List the to-do list groups contained within a to-do list. Use the status filter to browse archived or trashed groups.',
    metadata: {
      tag: 'Todo Groups',
      operationId: 'todoListGroups.list',
      docsPath: '/docs/basecamp-api-specs/sections/todolist_groups.md#list-to-do-list-groups',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/todolists/:todolistId/groups',
    pathParams: bucketAndTodoListPathParams,
    query: TodoListGroupQuerySchema.optional(),
    responses: {
      200: TodoListGroupsResponseSchema,
    },
  },
  create: {
    summary: 'Create a to-do list group',
    description:
      'Create a nested group inside a to-do list. Groups share the same representation as to-do lists.',
    metadata: {
      tag: 'Todo Groups',
      operationId: 'todoListGroups.create',
      docsPath: '/docs/basecamp-api-specs/sections/todolist_groups.md#create-a-to-do-list-group',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/todolists/:todolistId/groups',
    pathParams: bucketAndTodoListPathParams,
    body: TodoListGroupCreateBodySchema,
    responses: {
      201: TodoListSchema,
    },
  },
  reposition: {
    summary: 'Reposition a to-do list group',
    description: 'Change the position of a to-do list group within its parent list.',
    metadata: {
      tag: 'Todo Groups',
      operationId: 'todoListGroups.reposition',
      docsPath:
        '/docs/basecamp-api-specs/sections/todolist_groups.md#reposition-a-to-do-list-group',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/todolists/groups/:groupId/position',
    pathParams: bucketAndGroupPathParams,
    body: TodoListGroupRepositionBodySchema,
    responses: {
      204: c.noBody(),
    },
  },
});

export type TodoListGroupsRouter = typeof todoListGroupsRouter;
