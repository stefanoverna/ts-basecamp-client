import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  ClientApprovalListQuerySchema,
  ClientApprovalListResponseSchema,
  ClientApprovalSchema,
} from '../../schemas/communications/client-approvals';

const ClientApprovalListPathParamsSchema = z.object({
  bucketId: BasecampIdParamSchema,
});

const ClientApprovalPathParamsSchema = ClientApprovalListPathParamsSchema.extend({
  approvalId: BasecampIdParamSchema,
});

export const clientApprovalsRouter = c.router({
  list: {
    summary: 'List client approvals',
    description:
      'Returns the client approvals that have been posted in a project. Results are paginated.',
    metadata: {
      tag: 'Client Approvals',
      operationId: 'clientApprovals.list',
      docsPath: '/docs/basecamp-api-specs/sections/client_approvals.md#get-client-approvals',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/client/approvals',
    pathParams: ClientApprovalListPathParamsSchema,
    query: ClientApprovalListQuerySchema,
    responses: {
      200: ClientApprovalListResponseSchema,
    },
  },
  get: {
    summary: 'Get a client approval',
    description: 'Fetch a specific client approval recording.',
    metadata: {
      tag: 'Client Approvals',
      operationId: 'clientApprovals.get',
      docsPath: '/docs/basecamp-api-specs/sections/client_approvals.md#get-a-client-approval',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/client/approvals/:approvalId',
    pathParams: ClientApprovalPathParamsSchema,
    responses: {
      200: ClientApprovalSchema,
    },
  },
});

export type ClientApprovalsRouter = typeof clientApprovalsRouter;
