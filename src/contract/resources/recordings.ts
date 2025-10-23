import { z } from 'zod';

import { c } from '../c';
import { BasecampIdParamSchema } from '../schemas/common';
import { RecordingListQuerySchema, RecordingListResponseSchema } from '../schemas/recordings';

const BucketRecordingPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  recordingId: BasecampIdParamSchema,
});

export const recordingsRouter = c.router({
  list: {
    summary: 'List recordings',
    description:
      'Returns a paginated list of recordings filtered by type and optional bucket or status filters. Use this endpoint to enumerate cross-project activity for a specific recording type.',
    metadata: {
      tag: 'Recordings',
      operationId: 'recordings.list',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#get-recordings',
    } as const,
    method: 'GET',
    path: '/projects/recordings',
    query: RecordingListQuerySchema,
    responses: {
      200: RecordingListResponseSchema,
    },
  },
  trash: {
    summary: 'Trash a recording',
    description: 'Mark a recording as trashed. Trashed recordings can be restored via the UI.',
    metadata: {
      tag: 'Recordings',
      operationId: 'recordings.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:recordingId/status/trashed',
    pathParams: BucketRecordingPathParamsSchema,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  archive: {
    summary: 'Archive a recording',
    description: 'Mark a recording as archived. Archived recordings remain available but hidden.',
    metadata: {
      tag: 'Recordings',
      operationId: 'recordings.archive',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#archive-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:recordingId/status/archived',
    pathParams: BucketRecordingPathParamsSchema,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
  activate: {
    summary: 'Unarchive a recording',
    description: 'Mark a recording as active to reverse a previous archive action.',
    metadata: {
      tag: 'Recordings',
      operationId: 'recordings.activate',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#unarchive-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:recordingId/status/active',
    pathParams: BucketRecordingPathParamsSchema,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type RecordingsRouter = typeof recordingsRouter;
