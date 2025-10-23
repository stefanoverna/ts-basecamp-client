import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  TodoCollectionResponseSchema,
  TodoCreateBodySchema,
  TodoQuerySchema,
  TodoRepositionBodySchema,
  TodoSchema,
  TodoUpdateBodySchema,
} from '../../schemas/tasks/todos';

const bucketPathParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndTodoListPathParams = bucketPathParams.extend({
  todolistId: BasecampIdParamSchema,
});

const bucketAndTodoPathParams = bucketPathParams.extend({
  todoId: BasecampIdParamSchema,
});

export const todosRouter = c.router({
  list: {
    summary: 'List to-dos',
    description:
      'List pending or completed to-dos within a to-do list. Use the status and completed filters to target archived or finished items.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.list',
      docsPath: '/docs/basecamp-api-specs/sections/todos.md#get-to-dos',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/todolists/:todolistId/todos',
    pathParams: bucketAndTodoListPathParams,
    query: TodoQuerySchema.optional(),
    responses: {
      200: TodoCollectionResponseSchema,
    },
  },
  get: {
    summary: 'Get a to-do',
    description: 'Fetch a single to-do item by its identifier.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.get',
      docsPath: '/docs/basecamp-api-specs/sections/todos.md#get-a-to-do',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/todos/:todoId',
    pathParams: bucketAndTodoPathParams,
    responses: {
      200: TodoSchema,
    },
  },
  create: {
    summary: 'Create a to-do',
    description:
      'Create a to-do inside a to-do list. Rich text HTML is accepted in the description.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.create',
      docsPath: '/docs/basecamp-api-specs/sections/todos.md#create-a-to-do',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/todolists/:todolistId/todos',
    pathParams: bucketAndTodoListPathParams,
    body: TodoCreateBodySchema,
    responses: {
      201: TodoSchema,
    },
  },
  update: {
    summary: 'Update a to-do',
    description:
      'Update the content, description, assignees, or scheduling fields of an existing to-do. The content field must always be provided.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.update',
      docsPath: '/docs/basecamp-api-specs/sections/todos.md#update-a-to-do',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/todos/:todoId',
    pathParams: bucketAndTodoPathParams,
    body: TodoUpdateBodySchema,
    responses: {
      200: TodoSchema,
    },
  },
  complete: {
    summary: 'Complete a to-do',
    description: 'Mark a to-do as completed.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.complete',
      docsPath: '/docs/basecamp-api-specs/sections/todos.md#complete-a-to-do',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/todos/:todoId/completion',
    pathParams: bucketAndTodoPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  uncomplete: {
    summary: 'Uncomplete a to-do',
    description: 'Remove the completion mark from a to-do.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.uncomplete',
      docsPath: '/docs/basecamp-api-specs/sections/todos.md#uncomplete-a-to-do',
    } as const,
    method: 'DELETE',
    path: '/buckets/:bucketId/todos/:todoId/completion',
    pathParams: bucketAndTodoPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  reposition: {
    summary: 'Reposition a to-do',
    description: 'Change the position of a to-do within its list.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.reposition',
      docsPath: '/docs/basecamp-api-specs/sections/todos.md#reposition-a-to-do',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/todos/:todoId/position',
    pathParams: bucketAndTodoPathParams,
    body: TodoRepositionBodySchema,
    responses: {
      204: c.noBody(),
    },
  },
  trash: {
    summary: 'Trash a to-do',
    description: 'Move a to-do to the trash queue.',
    metadata: {
      tag: 'Todos',
      operationId: 'todos.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:todoId/status/trashed',
    pathParams: bucketAndTodoPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type TodosRouter = typeof todosRouter;
