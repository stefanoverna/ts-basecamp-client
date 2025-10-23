import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

const CommentRecordingCoreSchema = RecordingBaseSchema.extend({
  type: z.literal('Comment'),
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
