import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  CampfireLineCreateBodySchema,
  CampfireLineListQuerySchema,
  CampfireLineListResponseSchema,
  CampfireLineSchema,
  CampfireListQuerySchema,
  CampfireListResponseSchema,
  CampfireSchema,
} from '../../schemas/communications/campfires';

const CampfirePathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
  campfireId: BasecampIdParamSchema,
});

const CampfireLinePathParamsSchema = CampfirePathParamsSchema.extend({
  lineId: BasecampIdParamSchema,
});

export const campfiresRouter = c.router({
  list: {
    summary: 'List Campfires',
    description:
      'Returns the Campfires visible to the authenticated user. Results are paginated via Link headers.',
    metadata: {
      tag: 'Campfires',
      operationId: 'campfires.list',
      docsPath: '/docs/basecamp-api-specs/sections/campfires.md#get-campfires',
    } as const,
    method: 'GET',
    path: '/chats',
    query: CampfireListQuerySchema,
    responses: {
      200: CampfireListResponseSchema,
    },
  },
  get: {
    summary: 'Get a Campfire',
    description: 'Fetch a single Campfire transcript for a project.',
    metadata: {
      tag: 'Campfires',
      operationId: 'campfires.get',
      docsPath: '/docs/basecamp-api-specs/sections/campfires.md#get-a-campfire',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/chats/:campfireId',
    pathParams: CampfirePathParamsSchema,
    responses: {
      200: CampfireSchema,
    },
  },
  listLines: {
    summary: 'List Campfire lines',
    description: 'Return paginated chat lines for a Campfire transcript.',
    metadata: {
      tag: 'Campfires',
      operationId: 'campfires.listLines',
      docsPath: '/docs/basecamp-api-specs/sections/campfires.md#get-campfire-lines',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/chats/:campfireId/lines',
    pathParams: CampfirePathParamsSchema,
    query: CampfireLineListQuerySchema,
    responses: {
      200: CampfireLineListResponseSchema,
    },
  },
  getLine: {
    summary: 'Get a Campfire line',
    description: 'Fetch a single Campfire line by identifier.',
    metadata: {
      tag: 'Campfires',
      operationId: 'campfires.getLine',
      docsPath: '/docs/basecamp-api-specs/sections/campfires.md#get-a-campfire-line',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/chats/:campfireId/lines/:lineId',
    pathParams: CampfireLinePathParamsSchema,
    responses: {
      200: CampfireLineSchema,
    },
  },
  createLine: {
    summary: 'Create a Campfire line',
    description: 'Post a new line of chat to a Campfire transcript.',
    metadata: {
      tag: 'Campfires',
      operationId: 'campfires.createLine',
      docsPath: '/docs/basecamp-api-specs/sections/campfires.md#create-a-campfire-line',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/chats/:campfireId/lines',
    pathParams: CampfirePathParamsSchema,
    body: CampfireLineCreateBodySchema,
    responses: {
      201: CampfireLineSchema,
    },
  },
  deleteLine: {
    summary: 'Delete a Campfire line',
    description: 'Delete a Campfire line permanently.',
    metadata: {
      tag: 'Campfires',
      operationId: 'campfires.deleteLine',
      docsPath: '/docs/basecamp-api-specs/sections/campfires.md#delete-a-campfire-line',
    } as const,
    method: 'DELETE',
    path: '/buckets/:bucketId/chats/:campfireId/lines/:lineId',
    pathParams: CampfireLinePathParamsSchema,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type CampfiresRouter = typeof campfiresRouter;
