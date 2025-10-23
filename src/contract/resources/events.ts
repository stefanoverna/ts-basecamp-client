import { z } from 'zod';

import { c } from '../c';
import { BasecampIdParamSchema } from '../schemas/common';
import { RecordingEventListQuerySchema, RecordingEventListResponseSchema } from '../schemas/events';

const RecordingEventsPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  recordingId: BasecampIdParamSchema,
});

export const eventsRouter = c.router({
  listForRecording: {
    summary: 'List recording events',
    description:
      'Returns the event history for a specific recording. Pagination data is available via Link headers.',
    metadata: {
      tag: 'Events',
      operationId: 'events.listForRecording',
      docsPath: '/docs/basecamp-api-specs/sections/events.md#get-events',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/recordings/:recordingId/events',
    pathParams: RecordingEventsPathParamsSchema,
    query: RecordingEventListQuerySchema.optional(),
    responses: {
      200: RecordingEventListResponseSchema,
    },
  },
});

export type EventsRouter = typeof eventsRouter;
