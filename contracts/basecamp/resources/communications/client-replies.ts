import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  ClientReplyListQuerySchema,
  ClientReplyListResponseSchema,
  ClientReplySchema,
} from '../../schemas/communications/client-replies';

const ClientReplyListPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  recordingId: BasecampIdParamSchema,
});

const ClientReplyPathParamsSchema = ClientReplyListPathParamsSchema.extend({
  replyId: BasecampIdParamSchema,
});

export const clientRepliesRouter = c.router({
  list: {
    summary: 'List client replies',
    description:
      'Returns replies that clients posted to client correspondences or client approvals.',
    metadata: {
      tag: 'Client Replies',
      operationId: 'clientReplies.list',
      docsPath: '/docs/basecamp-api-specs/sections/client_replies.md#get-client-replies',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/client/recordings/:recordingId/replies',
    pathParams: ClientReplyListPathParamsSchema,
    query: ClientReplyListQuerySchema,
    responses: {
      200: ClientReplyListResponseSchema,
    },
  },
  get: {
    summary: 'Get a client reply',
    description: 'Fetch a single reply posted by a client.',
    metadata: {
      tag: 'Client Replies',
      operationId: 'clientReplies.get',
      docsPath: '/docs/basecamp-api-specs/sections/client_replies.md#get-a-client-reply',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/client/recordings/:recordingId/replies/:replyId',
    pathParams: ClientReplyPathParamsSchema,
    responses: {
      200: ClientReplySchema,
    },
  },
});

export type ClientRepliesRouter = typeof clientRepliesRouter;
