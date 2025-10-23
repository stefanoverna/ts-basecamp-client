import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  CommentCreateBodySchema,
  CommentListQuerySchema,
  CommentSchema,
  CommentsResponseSchema,
  CommentUpdateBodySchema,
} from '../../schemas/communications/comments';

const bucketAndRecordingPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  recordingId: BasecampIdParamSchema,
});

const bucketAndCommentPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  commentId: BasecampIdParamSchema,
});

export const commentsRouter = c.router({
  list: {
    summary: 'List comments',
    description: 'Return paginated comments for a recording.',
    metadata: {
      tag: 'Comments',
      operationId: 'comments.list',
      docsPath: '/docs/basecamp-api-specs/sections/comments.md#get-comments',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/recordings/:recordingId/comments',
    pathParams: bucketAndRecordingPathParams,
    query: CommentListQuerySchema,
    responses: {
      200: CommentsResponseSchema,
    },
  },
  get: {
    summary: 'Get a comment',
    description: 'Return a specific comment by its ID.',
    metadata: {
      tag: 'Comments',
      operationId: 'comments.get',
      docsPath: '/docs/basecamp-api-specs/sections/comments.md#get-a-comment',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/comments/:commentId',
    pathParams: bucketAndCommentPathParams,
    responses: {
      200: CommentSchema,
    },
  },
  create: {
    summary: 'Create a comment',
    description: 'Create a new comment on a recording.',
    metadata: {
      tag: 'Comments',
      operationId: 'comments.create',
      docsPath: '/docs/basecamp-api-specs/sections/comments.md#create-a-comment',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/recordings/:recordingId/comments',
    pathParams: bucketAndRecordingPathParams,
    body: CommentCreateBodySchema,
    responses: {
      201: CommentSchema,
    },
  },
  update: {
    summary: 'Update a comment',
    description: 'Update an existing comment.',
    metadata: {
      tag: 'Comments',
      operationId: 'comments.update',
      docsPath: '/docs/basecamp-api-specs/sections/comments.md#update-a-comment',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/comments/:commentId',
    pathParams: bucketAndCommentPathParams,
    body: CommentUpdateBodySchema,
    responses: {
      200: CommentSchema,
    },
  },
  trash: {
    summary: 'Trash a comment',
    description: 'Move a comment to the trash.',
    metadata: {
      tag: 'Comments',
      operationId: 'comments.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:commentId/status/trashed',
    pathParams: bucketAndCommentPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type CommentsRouter = typeof commentsRouter;
