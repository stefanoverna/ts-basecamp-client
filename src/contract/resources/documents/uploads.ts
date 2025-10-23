import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  UploadCreateBodySchema,
  UploadListQuerySchema,
  UploadListResponseSchema,
  UploadSchema,
  UploadUpdateBodySchema,
} from '../../schemas/documents';

const bucketAndVaultPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  vaultId: BasecampIdParamSchema,
});

const bucketAndUploadPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  uploadId: BasecampIdParamSchema,
});

export const uploadsRouter = c.router({
  list: {
    summary: 'List uploads',
    description:
      'Returns a paginated list of active uploads in a vault. Pagination data is available via the Link and X-Total-Count headers.',
    metadata: {
      tag: 'Uploads',
      operationId: 'uploads.list',
      docsPath: '/docs/basecamp-api-specs/sections/uploads.md#get-uploads',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/vaults/:vaultId/uploads',
    pathParams: bucketAndVaultPathParams,
    query: UploadListQuerySchema,
    responses: {
      200: UploadListResponseSchema,
    },
  },
  get: {
    summary: 'Get an upload',
    description: 'Fetch the full representation of a single upload.',
    metadata: {
      tag: 'Uploads',
      operationId: 'uploads.get',
      docsPath: '/docs/basecamp-api-specs/sections/uploads.md#get-an-upload',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/uploads/:uploadId',
    pathParams: bucketAndUploadPathParams,
    responses: {
      200: UploadSchema,
    },
  },
  create: {
    summary: 'Create an upload',
    description:
      'Create an upload in a vault using a previously obtained attachable_sgid from the attachments endpoint.',
    metadata: {
      tag: 'Uploads',
      operationId: 'uploads.create',
      docsPath: '/docs/basecamp-api-specs/sections/uploads.md#create-an-upload',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/vaults/:vaultId/uploads',
    pathParams: bucketAndVaultPathParams,
    body: UploadCreateBodySchema,
    responses: {
      201: UploadSchema,
    },
  },
  update: {
    summary: 'Update an upload',
    description: 'Update the description or base name of an existing upload.',
    metadata: {
      tag: 'Uploads',
      operationId: 'uploads.update',
      docsPath: '/docs/basecamp-api-specs/sections/uploads.md#update-an-upload',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/uploads/:uploadId',
    pathParams: bucketAndUploadPathParams,
    body: UploadUpdateBodySchema,
    responses: {
      200: UploadSchema,
    },
  },
  trash: {
    summary: 'Trash an upload',
    description: 'Move an upload recording to the trash. Trashed items can be restored via the UI.',
    metadata: {
      tag: 'Uploads',
      operationId: 'uploads.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:uploadId/status/trashed',
    pathParams: bucketAndUploadPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type UploadsRouter = typeof uploadsRouter;
