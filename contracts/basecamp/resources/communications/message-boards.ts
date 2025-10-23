import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  MessageBoardSchema,
  MessageBoardsResponseSchema,
} from '../../schemas/communications/message-boards';

const bucketAndMessageBoardPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  messageBoardId: BasecampIdParamSchema,
});

const projectPathParams = z.object({
  projectId: BasecampIdParamSchema,
});

export const messageBoardsRouter = c.router({
  get: {
    summary: 'Get a message board',
    description: 'Return a message board container for a project.',
    metadata: {
      tag: 'Message Boards',
      operationId: 'messageBoards.get',
      docsPath: '/docs/basecamp-api-specs/sections/message_boards.md#get-message-board',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/message_boards/:messageBoardId',
    pathParams: bucketAndMessageBoardPathParams,
    responses: {
      200: MessageBoardSchema,
    },
  },
  listForProject: {
    summary: 'List message boards for a project',
    description: 'Return message boards available for a project.',
    metadata: {
      tag: 'Message Boards',
      operationId: 'messageBoards.listForProject',
      docsPath: '/docs/basecamp-api-specs/sections/message_boards.md#get-message-board',
    } as const,
    method: 'GET',
    path: '/projects/:projectId/message_boards',
    pathParams: projectPathParams,
    responses: {
      200: MessageBoardsResponseSchema,
    },
  },
});

export type MessageBoardsRouter = typeof messageBoardsRouter;
