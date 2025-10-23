import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

export const DocumentCoreSchema = RecordingBaseSchema.extend({
  type: z.literal('Document'),
});

export const DocumentSchema = DocumentCoreSchema.extend({
  content: HtmlStringSchema,
});

export const DocumentListResponseSchema = z.array(DocumentSchema);

export const DocumentListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const DocumentCreateBodySchema = z.object({
  title: z.string().min(1),
  content: HtmlStringSchema,
  status: z.enum(['active', 'draft']).or(z.string()).optional(),
});

export const DocumentUpdateBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    content: HtmlStringSchema.optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one field must be provided to update a document.',
  );

export type Document = z.infer<typeof DocumentSchema>;
export type DocumentListQuery = z.infer<typeof DocumentListQuerySchema>;
export type DocumentCreateBody = z.infer<typeof DocumentCreateBodySchema>;
export type DocumentUpdateBody = z.infer<typeof DocumentUpdateBodySchema>;
