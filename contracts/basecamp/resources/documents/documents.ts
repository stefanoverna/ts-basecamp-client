import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  DocumentCreateBodySchema,
  DocumentListQuerySchema,
  DocumentListResponseSchema,
  DocumentSchema,
  DocumentUpdateBodySchema,
} from '../../schemas/documents';

const bucketAndVaultPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  vaultId: BasecampIdParamSchema,
});

const bucketAndDocumentPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  documentId: BasecampIdParamSchema,
});

export const documentsRouter = c.router({
  list: {
    summary: 'List documents',
    description:
      'Returns a paginated list of active documents in a vault. Pagination data is available via the Link and X-Total-Count headers.',
    metadata: {
      tag: 'Documents',
      operationId: 'documents.list',
      docsPath: '/docs/basecamp-api-specs/sections/documents.md#get-documents',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/vaults/:vaultId/documents',
    pathParams: bucketAndVaultPathParams,
    query: DocumentListQuerySchema,
    responses: {
      200: DocumentListResponseSchema,
    },
  },
  get: {
    summary: 'Get a document',
    description: 'Fetch the full representation of a single document.',
    metadata: {
      tag: 'Documents',
      operationId: 'documents.get',
      docsPath: '/docs/basecamp-api-specs/sections/documents.md#get-a-document',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/documents/:documentId',
    pathParams: bucketAndDocumentPathParams,
    responses: {
      200: DocumentSchema,
    },
  },
  create: {
    summary: 'Create a document',
    description:
      'Publish a document in a vault. Setting status to "active" makes the document visible immediately.',
    metadata: {
      tag: 'Documents',
      operationId: 'documents.create',
      docsPath: '/docs/basecamp-api-specs/sections/documents.md#create-a-document',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/vaults/:vaultId/documents',
    pathParams: bucketAndVaultPathParams,
    body: DocumentCreateBodySchema,
    responses: {
      201: DocumentSchema,
    },
  },
  update: {
    summary: 'Update a document',
    description: 'Update the title or content of an existing document.',
    metadata: {
      tag: 'Documents',
      operationId: 'documents.update',
      docsPath: '/docs/basecamp-api-specs/sections/documents.md#update-a-document',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/documents/:documentId',
    pathParams: bucketAndDocumentPathParams,
    body: DocumentUpdateBodySchema,
    responses: {
      200: DocumentSchema,
    },
  },
  trash: {
    summary: 'Trash a document',
    description:
      'Move a document recording to the trash. Trashed items can be restored via the UI.',
    metadata: {
      tag: 'Documents',
      operationId: 'documents.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:documentId/status/trashed',
    pathParams: bucketAndDocumentPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type DocumentsRouter = typeof documentsRouter;
