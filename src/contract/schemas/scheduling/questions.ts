import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

/**
 * Question schedule configuration.
 */
export const QuestionScheduleSchema = z.object({
  frequency: z.string(),
  days: z.array(z.number().int()),
  hour: z.number().int(),
  minute: z.number().int(),
  week_instance: z.number().int().nullable(),
  week_interval: z.number().int().nullable(),
  month_interval: z.number().int().nullable(),
  start_date: z.string(),
  end_date: z.string().nullable(),
});

/**
 * Complete question resource.
 */
export const QuestionSchema = RecordingBaseSchema.extend({
  type: z.literal('Question'),
  paused: z.boolean(),
  schedule: QuestionScheduleSchema,
  answers_count: z.number().int(),
  answers_url: z.string().url(),
});

/**
 * List response for questions.
 */
export const QuestionListResponseSchema = z.array(QuestionSchema);

/**
 * Query parameters for listing questions.
 */
export const QuestionListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;
export type QuestionSchedule = z.infer<typeof QuestionScheduleSchema>;
export type QuestionListQuery = z.infer<typeof QuestionListQuerySchema>;
