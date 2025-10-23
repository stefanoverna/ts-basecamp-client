import { z } from 'zod';

import { c } from '../c';
import { BasecampIdParamSchema } from '../schemas/common';
import {
  LineupMarkerCreateBodySchema,
  LineupMarkerUpdateBodySchema,
} from '../schemas/lineup-markers';

const LineupMarkerPathParamsSchema = z.object({
  markerId: BasecampIdParamSchema,
});

export const lineupMarkersRouter = c.router({
  create: {
    summary: 'Create a lineup marker',
    description: 'Create an account-wide lineup marker that appears on the Lineup timeline.',
    metadata: {
      tag: 'LineupMarkers',
      operationId: 'lineupMarkers.create',
      docsPath: '/docs/basecamp-api-specs/sections/lineup_markers.md#create-a-marker',
    } as const,
    method: 'POST',
    path: '/lineup/markers',
    body: LineupMarkerCreateBodySchema,
    responses: {
      201: c.noBody(),
    },
  },
  update: {
    summary: 'Update a lineup marker',
    description: 'Update the name or date of an existing lineup marker.',
    metadata: {
      tag: 'LineupMarkers',
      operationId: 'lineupMarkers.update',
      docsPath: '/docs/basecamp-api-specs/sections/lineup_markers.md#update-a-marker',
    } as const,
    method: 'PUT',
    path: '/lineup/markers/:markerId',
    pathParams: LineupMarkerPathParamsSchema,
    body: LineupMarkerUpdateBodySchema,
    responses: {
      200: c.noBody(),
    },
  },
  destroy: {
    summary: 'Destroy a lineup marker',
    description: 'Permanently delete a lineup marker immediately.',
    metadata: {
      tag: 'LineupMarkers',
      operationId: 'lineupMarkers.destroy',
      docsPath: '/docs/basecamp-api-specs/sections/lineup_markers.md#destroy-a-marker',
    } as const,
    method: 'DELETE',
    path: '/lineup/markers/:markerId',
    pathParams: LineupMarkerPathParamsSchema,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type LineupMarkersRouter = typeof lineupMarkersRouter;
