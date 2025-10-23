import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  CardTableColumnSchema,
  CardTableColumnCreateBodySchema,
  CardTableColumnUpdateBodySchema,
  CardTableColumnMoveBodySchema,
  CardTableColumnColorBodySchema,
} from '../../schemas/kanban';

const bucketParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndCardTableParams = bucketParams.extend({
  cardTableId: BasecampIdParamSchema,
});

const bucketAndColumnParams = bucketParams.extend({
  columnId: BasecampIdParamSchema,
});

export const cardTableColumnsRouter = c.router({
  get: {
    summary: 'Get a card table column',
    description: 'Fetch a single column belonging to a card table.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.get',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_columns.md#get-a-column',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/card_tables/columns/:columnId',
    pathParams: bucketAndColumnParams,
    responses: {
      200: CardTableColumnSchema,
    },
  },
  create: {
    summary: 'Create a card table column',
    description:
      'Create a new column within a card table. Descriptions accept rich text HTML strings.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.create',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_columns.md#create-a-column',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/:cardTableId/columns',
    pathParams: bucketAndCardTableParams,
    body: CardTableColumnCreateBodySchema,
    responses: {
      201: CardTableColumnSchema,
    },
  },
  update: {
    summary: 'Update a card table column',
    description:
      'Update the title or description of a column. At least one field must be provided per request.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.update',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_columns.md#update-a-column',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/card_tables/columns/:columnId',
    pathParams: bucketAndColumnParams,
    body: CardTableColumnUpdateBodySchema,
    responses: {
      200: CardTableColumnSchema,
    },
  },
  move: {
    summary: 'Move a card table column',
    description:
      'Reorder a column within a card table. Positions are evaluated within the table, ignoring system columns like Triage and Done.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.move',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_columns.md#move-a-column',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/:cardTableId/moves',
    pathParams: bucketAndCardTableParams,
    body: CardTableColumnMoveBodySchema,
    responses: {
      204: c.noBody(),
    },
  },
  watch: {
    summary: 'Watch a card table column',
    description: 'Subscribe the current user to notifications for a column.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.watch',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_columns.md#watch-a-column',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/lists/:columnId/subscription',
    pathParams: bucketAndColumnParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  unwatch: {
    summary: 'Stop watching a card table column',
    description: 'Unsubscribe the current user from column notifications.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.unwatch',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_columns.md#watch-a-column',
    } as const,
    method: 'DELETE',
    path: '/buckets/:bucketId/card_tables/lists/:columnId/subscription',
    pathParams: bucketAndColumnParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  enableOnHold: {
    summary: 'Enable on hold for a column',
    description: 'Enable the on-hold section for a card table column.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.enableOnHold',
      docsPath:
        '/docs/basecamp-api-specs/sections/card_table_columns.md#change-on-hold-on-a-column',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/columns/:columnId/on_hold',
    pathParams: bucketAndColumnParams,
    body: c.noBody(),
    responses: {
      200: CardTableColumnSchema,
    },
  },
  disableOnHold: {
    summary: 'Disable on hold for a column',
    description: 'Remove the on-hold section from a card table column.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.disableOnHold',
      docsPath:
        '/docs/basecamp-api-specs/sections/card_table_columns.md#change-on-hold-on-a-column',
    } as const,
    method: 'DELETE',
    path: '/buckets/:bucketId/card_tables/columns/:columnId/on_hold',
    pathParams: bucketAndColumnParams,
    body: c.noBody(),
    responses: {
      200: CardTableColumnSchema,
    },
  },
  updateColor: {
    summary: 'Update column color',
    description: 'Set the color for a card table column.',
    metadata: {
      tag: 'Card Table Columns',
      operationId: 'cardTableColumns.updateColor',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_columns.md#change-color-of-a-column',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/card_tables/columns/:columnId/color',
    pathParams: bucketAndColumnParams,
    body: CardTableColumnColorBodySchema,
    responses: {
      200: CardTableColumnSchema,
    },
  },
});

export type CardTableColumnsRouter = typeof cardTableColumnsRouter;
