import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  TodoListCreateBodySchema,
  TodoListQuerySchema,
  TodoListSchema,
  TodoListUpdateBodySchema,
  TodoListsResponseSchema,
  TodoTopLevelListSchema,
} from '../../schemas/tasks/todolists';

const bucketPathParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndTodoSetPathParams = bucketPathParams.extend({
  todosetId: BasecampIdParamSchema,
});

const bucketAndTodoListPathParams = bucketPathParams.extend({
  todolistId: BasecampIdParamSchema,
});

export const todoListsRouter = c.router({
  list: {
    summary: 'List to-do lists',
    description:
      'List active to-do lists within a to-do set. Pagination metadata is exposed via Link headers.',
    metadata: {
      tag: 'Todo Lists',
      operationId: 'todoLists.list',
      docsPath: '/docs/basecamp-api-specs/sections/todolists.md#get-to-do-lists',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/todosets/:todosetId/todolists',
    pathParams: bucketAndTodoSetPathParams,
    query: TodoListQuerySchema.optional(),
    responses: {
      200: TodoListsResponseSchema,
    },
  },
  get: {
    summary: 'Get a to-do list',
    description:
      'Fetch a to-do list or group. When the list represents a group, the payload includes a group_position_url instead of groups_url.',
    metadata: {
      tag: 'Todo Lists',
      operationId: 'todoLists.get',
      docsPath: '/docs/basecamp-api-specs/sections/todolists.md#get-a-to-do-list',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/todolists/:todolistId',
    pathParams: bucketAndTodoListPathParams,
    responses: {
      200: TodoListSchema,
    },
  },
  create: {
    summary: 'Create a to-do list',
    description: 'Create a new to-do list inside a to-do set. Descriptions accept rich text HTML.',
    metadata: {
      tag: 'Todo Lists',
      operationId: 'todoLists.create',
      docsPath: '/docs/basecamp-api-specs/sections/todolists.md#create-a-to-do-list',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/todosets/:todosetId/todolists',
    pathParams: bucketAndTodoSetPathParams,
    body: TodoListCreateBodySchema,
    responses: {
      201: TodoTopLevelListSchema,
    },
  },
  update: {
    summary: 'Update a to-do list',
    description:
      'Update the name or description of an existing to-do list. Basecamp requires the name to be present on every update.',
    metadata: {
      tag: 'Todo Lists',
      operationId: 'todoLists.update',
      docsPath: '/docs/basecamp-api-specs/sections/todolists.md#update-a-to-do-list',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/todolists/:todolistId',
    pathParams: bucketAndTodoListPathParams,
    body: TodoListUpdateBodySchema,
    responses: {
      200: TodoListSchema,
    },
  },
  trash: {
    summary: 'Trash a to-do list',
    description:
      'Move a to-do list or group to the trash. Trashed items can be restored from the Basecamp UI.',
    metadata: {
      tag: 'Todo Lists',
      operationId: 'todoLists.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:todolistId/status/trashed',
    pathParams: bucketAndTodoListPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type TodoListsRouter = typeof todoListsRouter;
