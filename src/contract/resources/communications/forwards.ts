import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  ForwardListQuerySchema,
  ForwardListResponseSchema,
  ForwardSchema,
} from '../../schemas/communications/forwards';

const ForwardListPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  inboxId: BasecampIdParamSchema,
});

const ForwardPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  forwardId: BasecampIdParamSchema,
});

export const forwardsRouter = c.router({
  list: {
    summary: 'List forwards',
    description:
      'Returns the email forwards that live under a project inbox. Results are paginated via Link headers.',
    metadata: {
      tag: 'Forwards',
      operationId: 'forwards.list',
      docsPath: '/docs/basecamp-api-specs/sections/forwards.md#get-forwards',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/inboxes/:inboxId/forwards',
    pathParams: ForwardListPathParamsSchema,
    query: ForwardListQuerySchema,
    responses: {
      200: ForwardListResponseSchema,
    },
  },
  get: {
    summary: 'Get a forward',
    description: 'Fetch a single email forward recording.',
    metadata: {
      tag: 'Forwards',
      operationId: 'forwards.get',
      docsPath: '/docs/basecamp-api-specs/sections/forwards.md#get-a-forward',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/inbox_forwards/:forwardId',
    pathParams: ForwardPathParamsSchema,
    responses: {
      200: ForwardSchema,
    },
  },
  trash: {
    summary: 'Trash a forward',
    description:
      'Move a forward to the trash. Trashed forwards can be restored from the Basecamp UI if needed.',
    metadata: {
      tag: 'Forwards',
      operationId: 'forwards.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:forwardId/status/trashed',
    pathParams: ForwardPathParamsSchema,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type ForwardsRouter = typeof forwardsRouter;
