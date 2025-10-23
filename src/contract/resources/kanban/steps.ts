import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  CardTableStepSchema,
  CardTableStepCreateBodySchema,
  CardTableStepUpdateBodySchema,
  CardTableStepCompletionBodySchema,
  CardTableStepRepositionBodySchema,
} from '../../schemas/kanban';

const bucketParams = z.object({
  bucketId: BasecampIdParamSchema,
});

const bucketAndCardParams = bucketParams.extend({
  cardId: BasecampIdParamSchema,
});

const bucketAndStepParams = bucketParams.extend({
  stepId: BasecampIdParamSchema,
});

export const cardTableStepsRouter = c.router({
  create: {
    summary: 'Create a step',
    description:
      'Create a checklist step within a card. Assignees should be provided as a comma-separated list of person IDs.',
    metadata: {
      tag: 'Card Table Steps',
      operationId: 'cardTableSteps.create',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_steps.md#create-a-step',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/cards/:cardId/steps',
    pathParams: bucketAndCardParams,
    body: CardTableStepCreateBodySchema,
    responses: {
      201: CardTableStepSchema,
    },
  },
  update: {
    summary: 'Update a step',
    description:
      'Update the title, due date, or assignees of a step. At least one field must be supplied.',
    metadata: {
      tag: 'Card Table Steps',
      operationId: 'cardTableSteps.update',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_steps.md#update-a-step',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/card_tables/steps/:stepId',
    pathParams: bucketAndStepParams,
    body: CardTableStepUpdateBodySchema,
    responses: {
      200: CardTableStepSchema,
    },
  },
  setCompletion: {
    summary: 'Change step completion status',
    description: 'Toggle a step between completed and uncompleted states.',
    metadata: {
      tag: 'Card Table Steps',
      operationId: 'cardTableSteps.setCompletion',
      docsPath:
        '/docs/basecamp-api-specs/sections/card_table_steps.md#change-step-completion-status',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/card_tables/steps/:stepId/completions',
    pathParams: bucketAndStepParams,
    body: CardTableStepCompletionBodySchema,
    responses: {
      200: CardTableStepSchema,
    },
  },
  reposition: {
    summary: 'Reposition a step',
    description: 'Move a step to a new zero-indexed position within a card.',
    metadata: {
      tag: 'Card Table Steps',
      operationId: 'cardTableSteps.reposition',
      docsPath: '/docs/basecamp-api-specs/sections/card_table_steps.md#reposition-a-step',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/card_tables/cards/:cardId/positions',
    pathParams: bucketAndCardParams,
    body: CardTableStepRepositionBodySchema,
    responses: {
      204: c.noBody(),
    },
  },
});

export type CardTableStepsRouter = typeof cardTableStepsRouter;
