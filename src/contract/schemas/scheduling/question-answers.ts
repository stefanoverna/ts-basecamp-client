import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

/**
 * Complete question answer resource.
 */
export const QuestionAnswerSchema = RecordingBaseSchema.extend({
  type: z.literal('Question::Answer'),
  content: HtmlStringSchema,
  group_on: z.string(),
});

/**
 * List response for question answers.
 */
export const QuestionAnswerListResponseSchema = z.array(QuestionAnswerSchema);

/**
 * Query parameters for listing question answers.
 */
export const QuestionAnswerListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

/**
 * Body for creating a question answer.
 */
export const QuestionAnswerCreateBodySchema = z.object({
  content: HtmlStringSchema.min(1),
  group_on: z.string(),
});

export type QuestionAnswer = z.infer<typeof QuestionAnswerSchema>;
export type QuestionAnswerListQuery = z.infer<
  typeof QuestionAnswerListQuerySchema
>;
export type QuestionAnswerCreateBody = z.infer<
  typeof QuestionAnswerCreateBodySchema
>;
