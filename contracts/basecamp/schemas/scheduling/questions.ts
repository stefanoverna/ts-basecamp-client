import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

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
export const QuestionSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.literal('Question'),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url(),
  subscription_url: z.string().url(),
  parent: RecordingRefSchema,
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
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
