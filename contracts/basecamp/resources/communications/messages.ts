import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  MessageCreateBodySchema,
  MessageListQuerySchema,
  MessageListResponseSchema,
  MessageSchema,
  MessageUpdateBodySchema,
} from '../../schemas/communications/messages';

const bucketAndBoardPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  messageBoardId: BasecampIdParamSchema,
});

const bucketAndMessagePathParams = z.object({
  bucketId: BasecampIdParamSchema,
  messageId: BasecampIdParamSchema,
});

export const messagesRouter = c.router({
  list: {
    summary: 'List message board messages',
    description:
      'Returns the messages currently visible on a message board. Pagination data is available via the Link and X-Total-Count headers.',
    metadata: {
      tag: 'Messages',
      operationId: 'messages.list',
      docsPath: '/docs/basecamp-api-specs/sections/messages.md#get-messages',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/message_boards/:messageBoardId/messages',
    pathParams: bucketAndBoardPathParams,
    query: MessageListQuerySchema,
    responses: {
      200: MessageListResponseSchema,
    },
  },
  get: {
    summary: 'Get a message',
    description: 'Fetch the full representation of a single message.',
    metadata: {
      tag: 'Messages',
      operationId: 'messages.get',
      docsPath: '/docs/basecamp-api-specs/sections/messages.md#get-a-message',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/messages/:messageId',
    pathParams: bucketAndMessagePathParams,
    responses: {
      200: MessageSchema,
    },
  },
  create: {
    summary: 'Create a message',
    description:
      'Publish a message to a specific message board. Setting status to "active" makes the message visible immediately.',
    metadata: {
      tag: 'Messages',
      operationId: 'messages.create',
      docsPath: '/docs/basecamp-api-specs/sections/messages.md#create-a-message',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/message_boards/:messageBoardId/messages',
    pathParams: bucketAndBoardPathParams,
    body: MessageCreateBodySchema,
    responses: {
      201: MessageSchema,
    },
  },
  update: {
    summary: 'Update a message',
    description: 'Update the subject, content, or category of an existing message.',
    metadata: {
      tag: 'Messages',
      operationId: 'messages.update',
      docsPath: '/docs/basecamp-api-specs/sections/messages.md#update-a-message',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/messages/:messageId',
    pathParams: bucketAndMessagePathParams,
    body: MessageUpdateBodySchema,
    responses: {
      200: MessageSchema,
    },
  },
  pin: {
    summary: 'Pin a message',
    description: 'Pin a message recording. The same endpoint is used to pin other recording types.',
    metadata: {
      tag: 'Messages',
      operationId: 'messages.pin',
      docsPath: '/docs/basecamp-api-specs/sections/messages.md#pin-a-message',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/recordings/:messageId/pin',
    pathParams: bucketAndMessagePathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  unpin: {
    summary: 'Unpin a message',
    description: 'Remove a pinned message. Returns no content on success.',
    metadata: {
      tag: 'Messages',
      operationId: 'messages.unpin',
      docsPath: '/docs/basecamp-api-specs/sections/messages.md#pin-a-message',
    } as const,
    method: 'DELETE',
    path: '/buckets/:bucketId/recordings/:messageId/pin',
    pathParams: bucketAndMessagePathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  trash: {
    summary: 'Trash a message',
    description: 'Move a message recording to the trash. Trashed items can be restored via the UI.',
    metadata: {
      tag: 'Messages',
      operationId: 'messages.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:messageId/status/trashed',
    pathParams: bucketAndMessagePathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type MessagesRouter = typeof messagesRouter;
