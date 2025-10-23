import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  MessageTypeCreateBodySchema,
  MessageTypeSchema,
  MessageTypesResponseSchema,
  MessageTypeUpdateBodySchema,
} from '../../schemas/communications/message-types';

const bucketPathParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndCategoryPathParams = bucketPathParams.extend({
  categoryId: BasecampIdParamSchema,
});

export const messageTypesRouter = c.router({
  list: {
    summary: 'List message types',
    description: 'Return all message types (categories) available in a project.',
    metadata: {
      tag: 'Message Types',
      operationId: 'messageTypes.list',
      docsPath: '/docs/basecamp-api-specs/sections/message_types.md#get-message-types',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/categories',
    pathParams: bucketPathParams,
    responses: {
      200: MessageTypesResponseSchema,
    },
  },
  get: {
    summary: 'Get a message type',
    description: 'Return a specific message type by its ID.',
    metadata: {
      tag: 'Message Types',
      operationId: 'messageTypes.get',
      docsPath: '/docs/basecamp-api-specs/sections/message_types.md#get-a-message-type',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/categories/:categoryId',
    pathParams: bucketAndCategoryPathParams,
    responses: {
      200: MessageTypeSchema,
    },
  },
  create: {
    summary: 'Create a message type',
    description: 'Create a new message type in a project.',
    metadata: {
      tag: 'Message Types',
      operationId: 'messageTypes.create',
      docsPath: '/docs/basecamp-api-specs/sections/message_types.md#create-a-message-type',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/categories',
    pathParams: bucketPathParams,
    body: MessageTypeCreateBodySchema,
    responses: {
      201: MessageTypeSchema,
    },
  },
  update: {
    summary: 'Update a message type',
    description: 'Update an existing message type.',
    metadata: {
      tag: 'Message Types',
      operationId: 'messageTypes.update',
      docsPath: '/docs/basecamp-api-specs/sections/message_types.md#update-a-message-type',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/categories/:categoryId',
    pathParams: bucketAndCategoryPathParams,
    body: MessageTypeUpdateBodySchema,
    responses: {
      200: MessageTypeSchema,
    },
  },
  destroy: {
    summary: 'Delete a message type',
    description: 'Delete a message type from a project.',
    metadata: {
      tag: 'Message Types',
      operationId: 'messageTypes.destroy',
      docsPath: '/docs/basecamp-api-specs/sections/message_types.md#destroy-a-message-type',
    } as const,
    method: 'DELETE',
    path: '/buckets/:bucketId/categories/:categoryId',
    pathParams: bucketAndCategoryPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type MessageTypesRouter = typeof messageTypesRouter;
