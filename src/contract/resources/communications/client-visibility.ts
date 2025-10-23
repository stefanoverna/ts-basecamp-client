import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  ClientVisibilityRecordingSchema,
  ClientVisibilityUpdateBodySchema,
} from '../../schemas/communications/client-visibility';

const ClientVisibilityPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  recordingId: BasecampIdParamSchema,
});

export const clientVisibilityRouter = c.router({
  update: {
    summary: 'Toggle client visibility',
    description:
      'Update whether a recording is visible to clients. Only recordings that control their own visibility can be toggled.',
    metadata: {
      tag: 'Client Visibility',
      operationId: 'clientVisibility.update',
      docsPath: '/docs/basecamp-api-specs/sections/client_visibility.md#toggle-client-visibility',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:recordingId/client_visibility',
    pathParams: ClientVisibilityPathParamsSchema,
    body: ClientVisibilityUpdateBodySchema,
    responses: {
      200: ClientVisibilityRecordingSchema,
    },
  },
});

export type ClientVisibilityRouter = typeof clientVisibilityRouter;
