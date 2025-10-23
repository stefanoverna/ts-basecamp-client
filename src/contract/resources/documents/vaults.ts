import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  VaultCreateBodySchema,
  VaultListQuerySchema,
  VaultListResponseSchema,
  VaultSchema,
  VaultUpdateBodySchema,
} from '../../schemas/documents';

const bucketAndVaultPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  vaultId: BasecampIdParamSchema,
});

const bucketAndParentVaultPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  parentVaultId: BasecampIdParamSchema,
});

export const vaultsRouter = c.router({
  list: {
    summary: 'List vaults',
    description:
      'Returns a paginated list of vaults nested under a parent vault. Pagination data is available via the Link and X-Total-Count headers.',
    metadata: {
      tag: 'Vaults',
      operationId: 'vaults.list',
      docsPath: '/docs/basecamp-api-specs/sections/vaults.md#get-vaults',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/vaults/:parentVaultId/vaults',
    pathParams: bucketAndParentVaultPathParams,
    query: VaultListQuerySchema,
    responses: {
      200: VaultListResponseSchema,
    },
  },
  get: {
    summary: 'Get a vault',
    description: 'Fetch the full representation of a single vault.',
    metadata: {
      tag: 'Vaults',
      operationId: 'vaults.get',
      docsPath: '/docs/basecamp-api-specs/sections/vaults.md#get-a-vault',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/vaults/:vaultId',
    pathParams: bucketAndVaultPathParams,
    responses: {
      200: VaultSchema,
    },
  },
  create: {
    summary: 'Create a vault',
    description: 'Create a new vault nested under a parent vault.',
    metadata: {
      tag: 'Vaults',
      operationId: 'vaults.create',
      docsPath: '/docs/basecamp-api-specs/sections/vaults.md#create-a-vault',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/vaults/:parentVaultId/vaults',
    pathParams: bucketAndParentVaultPathParams,
    body: VaultCreateBodySchema,
    responses: {
      201: VaultSchema,
    },
  },
  update: {
    summary: 'Update a vault',
    description: 'Update the title of an existing vault.',
    metadata: {
      tag: 'Vaults',
      operationId: 'vaults.update',
      docsPath: '/docs/basecamp-api-specs/sections/vaults.md#update-a-vault',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/vaults/:vaultId',
    pathParams: bucketAndVaultPathParams,
    body: VaultUpdateBodySchema,
    responses: {
      200: VaultSchema,
    },
  },
  trash: {
    summary: 'Trash a vault',
    description: 'Move a vault recording to the trash. Trashed items can be restored via the UI.',
    metadata: {
      tag: 'Vaults',
      operationId: 'vaults.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:vaultId/status/trashed',
    pathParams: bucketAndVaultPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type VaultsRouter = typeof vaultsRouter;
