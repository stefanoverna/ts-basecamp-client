import { z } from 'zod';

import { c } from '../c';

export const blobsRouter = c.router({
  download: {
    summary: 'Download a blob',
    description:
      'Download the raw file content of a blob. Blobs represent files embedded in documents and messages via bc-attachment tags.',
    metadata: {
      tag: 'Blobs',
      operationId: 'blobs.download',
      rawResponse: true,
    } as const,
    method: 'GET',
    path: '/blobs/:blobId/download/:filename',
    pathParams: z.object({
      blobId: z.string().min(1),
      filename: z.string().min(1),
    }),
    responses: {
      200: c.otherResponse({
        contentType: 'application/octet-stream',
        body: c.type<ArrayBuffer>(),
      }),
    },
  },
});

export type BlobsRouter = typeof blobsRouter;
