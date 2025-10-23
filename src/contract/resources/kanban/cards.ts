import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  CardTableCardSchema,
  CardTableCardListResponseSchema,
  CardTableCardListQuerySchema,
  CardTableCardCreateBodySchema,
  CardTableCardUpdateBodySchema,
  CardTableCardMoveBodySchema,
} from '../../schemas/kanban';

const bucketParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndColumnParams = bucketParams.extend({
  columnId: BasecampIdParamSchema,
});

const bucketAndCardParams = bucketParams.extend({
  cardId: BasecampIdParamSchema,
});

export const cardTableCardsRouter = c.router({
  list: {
    summary: 'List cards in a column',
    description:
      'Return the paginated list of cards belonging to a column. Pagination metadata is provided via Link headers.',
    metadata: {
      tag: 'Card Table Cards',
      operationId: 'cardTableCards.list',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_cards.md#get-cards-in-a-column',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/card_tables/lists/:columnId/cards',
    pathParams: bucketAndColumnParams,
    query: CardTableCardListQuerySchema.optional(),
    responses: {
      200: CardTableCardListResponseSchema,
    },
  },
  get: {
    summary: 'Get a card',
    description: 'Fetch the full representation of a card, including its steps.',
    metadata: {
      tag: 'Card Table Cards',
      operationId: 'cardTableCards.get',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_cards.md#get-a-card',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/card_tables/cards/:cardId',
    pathParams: bucketAndCardParams,
    responses: {
      200: CardTableCardSchema,
    },
  },
  create: {
    summary: 'Create a card',
    description:
      'Create a card inside a column. Content accepts rich text HTML; notify toggles assignee notifications.',
    metadata: {
      tag: 'Card Table Cards',
      operationId: 'cardTableCards.create',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_cards.md#create-a-card',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/lists/:columnId/cards',
    pathParams: bucketAndColumnParams,
    body: CardTableCardCreateBodySchema,
    responses: {
      201: CardTableCardSchema,
    },
  },
  update: {
    summary: 'Update a card',
    description:
      'Update the title, content, due date, or assignees of an existing card. At least one field must be provided.',
    metadata: {
      tag: 'Card Table Cards',
      operationId: 'cardTableCards.update',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_cards.md#update-a-card',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/card_tables/cards/:cardId',
    pathParams: bucketAndCardParams,
    body: CardTableCardUpdateBodySchema,
    responses: {
      200: CardTableCardSchema,
    },
  },
  move: {
    summary: 'Move a card',
    description:
      'Move a card to a different column and/or position. Positions are zero-indexed within the destination column.',
    metadata: {
      tag: 'Card Table Cards',
      operationId: 'cardTableCards.move',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_cards.md#move-a-card',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/cards/:cardId/moves',
    pathParams: bucketAndCardParams,
    body: CardTableCardMoveBodySchema,
    responses: {
      204: c.noBody(),
    },
  },
});

export type CardTableCardsRouter = typeof cardTableCardsRouter;
