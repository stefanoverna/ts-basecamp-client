import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  ClientCorrespondenceListQuerySchema,
  ClientCorrespondenceListResponseSchema,
  ClientCorrespondenceSchema,
} from '../../schemas/communications/client-correspondences';

const ClientCorrespondenceListPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
});

const ClientCorrespondencePathParamsSchema = ClientCorrespondenceListPathParamsSchema.extend({
  correspondenceId: BasecampIdParamSchema,
});

export const clientCorrespondencesRouter = c.router({
  list: {
    summary: 'List client correspondences',
    description: 'Returns the client correspondences posted in a project.',
    metadata: {
      tag: 'Client Correspondences',
      operationId: 'clientCorrespondences.list',
      docsPath:
        '/docs/basecamp-api-specs/sections/client_correspondences.md#get-client-correspondences',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/client/correspondences',
    pathParams: ClientCorrespondenceListPathParamsSchema,
    query: ClientCorrespondenceListQuerySchema,
    responses: {
      200: ClientCorrespondenceListResponseSchema,
    },
  },
  get: {
    summary: 'Get a client correspondence',
    description: 'Fetch a specific client correspondence recording.',
    metadata: {
      tag: 'Client Correspondences',
      operationId: 'clientCorrespondences.get',
      docsPath:
        '/docs/basecamp-api-specs/sections/client_correspondences.md#get-a-client-correspondence',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/client/correspondences/:correspondenceId',
    pathParams: ClientCorrespondencePathParamsSchema,
    responses: {
      200: ClientCorrespondenceSchema,
    },
  },
});

export type ClientCorrespondencesRouter = typeof clientCorrespondencesRouter;
