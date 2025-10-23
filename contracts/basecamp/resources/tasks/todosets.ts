import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import { TodoSetSchema } from '../../schemas/tasks/todosets';

const bucketPathParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndTodoSetPathParams = bucketPathParams.extend({
  todosetId: BasecampIdParamSchema,
});

export const todoSetsRouter = c.router({
  get: {
    summary: 'Get a to-do set',
    description:
      'Return the to-do set container for a project. Use this to discover to-do lists and their groups.',
    metadata: {
      tag: 'Todo Sets',
      operationId: 'todoSets.get',
      docsPath: '/docs/basecamp-api-specs/sections/todosets.md#get-to-do-set',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/todosets/:todosetId',
    pathParams: bucketAndTodoSetPathParams,
    responses: {
      200: TodoSetSchema,
    },
  },
});

export type TodoSetsRouter = typeof todoSetsRouter;
