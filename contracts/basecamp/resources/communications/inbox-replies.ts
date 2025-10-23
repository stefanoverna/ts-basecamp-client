import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  InboxReplyListQuerySchema,
  InboxReplyListResponseSchema,
  InboxReplySchema,
} from '../../schemas/communications/inbox-replies';

const InboxReplyListPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  forwardId: BasecampIdParamSchema,
});

const InboxReplyPathParamsSchema = InboxReplyListPathParamsSchema.extend({
  replyId: BasecampIdParamSchema,
});

export const inboxRepliesRouter = c.router({
  list: {
    summary: 'List inbox replies',
    description: 'Returns replies that were posted on a forwarded email.',
    metadata: {
      tag: 'Inbox Replies',
      operationId: 'inboxReplies.list',
      docsPath: '/docs/basecamp-api-specs/sections/inbox_replies.md#get-inbox-replies',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/inbox_forwards/:forwardId/replies',
    pathParams: InboxReplyListPathParamsSchema,
    query: InboxReplyListQuerySchema,
    responses: {
      200: InboxReplyListResponseSchema,
    },
  },
  get: {
    summary: 'Get an inbox reply',
    description: 'Fetch a single reply posted to a forwarded email.',
    metadata: {
      tag: 'Inbox Replies',
      operationId: 'inboxReplies.get',
      docsPath: '/docs/basecamp-api-specs/sections/inbox_replies.md#get-an-inbox-reply',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/inbox_forwards/:forwardId/replies/:replyId',
    pathParams: InboxReplyPathParamsSchema,
    responses: {
      200: InboxReplySchema,
    },
  },
});

export type InboxRepliesRouter = typeof inboxRepliesRouter;
