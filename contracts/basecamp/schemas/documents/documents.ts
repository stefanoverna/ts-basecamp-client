import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  HtmlStringSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

export const DocumentCoreSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.literal('Document'),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url(),
  subscription_url: z.string().url(),
  comments_count: z.number().int().nonnegative(),
  comments_url: z.string().url(),
  position: z.number().int().nonnegative(),
  parent: RecordingRefSchema,
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
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
