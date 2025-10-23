import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import { InboxSchema } from '../../schemas/communications/inboxes';

const InboxPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  inboxId: BasecampIdParamSchema,
});

export const inboxesRouter = c.router({
  get: {
    summary: 'Get an inbox',
    description:
      'Return the inbox container for a project. Use the forwards endpoint to list mail forwards associated with the inbox.',
    metadata: {
      tag: 'Inboxes',
      operationId: 'inboxes.get',
      docsPath: '/docs/basecamp-api-specs/sections/inboxes.md#get-inbox',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/inboxes/:inboxId',
    pathParams: InboxPathParamsSchema,
    responses: {
      200: InboxSchema,
    },
  },
});

export type InboxesRouter = typeof inboxesRouter;
