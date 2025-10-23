import { z } from 'zod';

/**
 * Response from creating an attachment via POST /attachments.json.
 * The attachable_sgid can be used in subsequent requests to create uploads or documents.
 */
export const AttachmentResponseSchema = z.object({
  attachable_sgid: z.string().min(1),
});

/**
 * Query parameters for creating an attachment.
 * The name parameter is required and should be the file name with extension.
 */
export const AttachmentCreateQuerySchema = z.object({
  name: z.string().min(1),
});

export type AttachmentResponse = z.infer<typeof AttachmentResponseSchema>;
export type AttachmentCreateQuery = z.infer<typeof AttachmentCreateQuerySchema>;
