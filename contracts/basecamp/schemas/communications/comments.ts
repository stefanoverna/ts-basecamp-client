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

const CommentRecordingCoreSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.string(),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url().optional(),
  parent: RecordingRefSchema.optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const CommentSchema = CommentRecordingCoreSchema.extend({
  content: HtmlStringSchema,
});

export const CommentsResponseSchema = z.array(CommentSchema);

export const CommentListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const CommentCreateBodySchema = z.object({
  content: HtmlStringSchema.min(1),
});

export const CommentUpdateBodySchema = z.object({
  content: HtmlStringSchema.min(1),
});

export type Comment = z.infer<typeof CommentSchema>;
export type CommentsResponse = z.infer<typeof CommentsResponseSchema>;
export type CommentListQuery = z.infer<typeof CommentListQuerySchema>;
export type CommentCreateBody = z.infer<typeof CommentCreateBodySchema>;
export type CommentUpdateBody = z.infer<typeof CommentUpdateBodySchema>;
