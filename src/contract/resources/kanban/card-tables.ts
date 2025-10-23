import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import { CardTableSchema } from '../../schemas/kanban';

const cardTablePathParams = z.object({
  bucketId: BasecampIdParamSchema,
  cardTableId: BasecampIdParamSchema,
});

export const cardTablesRouter = c.router({
  get: {
    summary: 'Get a card table',
    description:
      'Fetch the full representation of a card table, including column summaries and subscribers.',
    metadata: {
      tag: 'Card Tables',
      operationId: 'cardTables.get',
      docsPath: '/docs/basecamp-api-specs/sections/card_tables.md#get-a-card-table',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/card_tables/:cardTableId',
    pathParams: cardTablePathParams,
    responses: {
      200: CardTableSchema,
    },
  },
});

export type CardTablesRouter = typeof cardTablesRouter;
