import { c } from '../../c';
import { AttachmentCreateQuerySchema, AttachmentResponseSchema } from '../../schemas/documents';

export const attachmentsRouter = c.router({
  create: {
    summary: 'Create an attachment',
    description:
      'Upload a file to get an attachable_sgid that can be used in subsequent requests to create uploads or documents. The request body should be the raw binary file data. Note: Content-Type and Content-Length headers must be set by the caller.',
    metadata: {
      tag: 'Attachments',
      operationId: 'attachments.create',
      docsPath: '/docs/basecamp-api-specs/sections/attachments.md#create-an-attachment',
    } as const,
    method: 'POST',
    path: '/attachments',
    query: AttachmentCreateQuerySchema,
    body: c.type<ArrayBuffer>(),
    responses: {
      201: AttachmentResponseSchema,
    },
  },
});

export type AttachmentsRouter = typeof attachmentsRouter;
