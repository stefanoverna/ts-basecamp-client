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

/**
 * Recurrence schedule for recurring schedule entries.
 */
export const RecurrenceScheduleSchema = z.object({
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
 * Complete schedule entry resource.
 */
export const ScheduleEntrySchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.literal('Schedule::Entry'),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url(),
  subscription_url: z.string().url(),
  comments_count: z.number().int(),
  comments_url: z.string().url(),
  parent: RecordingRefSchema,
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
  description: HtmlStringSchema,
  summary: z.string(),
  all_day: z.boolean(),
  starts_at: z.string(),
  ends_at: z.string(),
  participants: z.array(PersonSummarySchema),
  recurrence_schedule: RecurrenceScheduleSchema.optional(),
});

/**
 * List response for schedule entries.
 */
export const ScheduleEntryListResponseSchema = z.array(ScheduleEntrySchema);

/**
 * Query parameters for listing schedule entries.
 */
export const ScheduleEntryListQuerySchema = z.object({
  status: RecordingStatusSchema.optional(),
  page: z.coerce.number().int().positive().optional(),
});

/**
 * Request body for creating a schedule entry.
 */
export const ScheduleEntryCreateBodySchema = z.object({
  summary: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  description: HtmlStringSchema.optional(),
  participant_ids: z.array(BasecampIdSchema).optional(),
  all_day: z.boolean().optional(),
  notify: z.boolean().optional(),
});

/**
 * Request body for updating a schedule entry.
 */
export const ScheduleEntryUpdateBodySchema = z.object({
  summary: z.string().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  description: HtmlStringSchema.optional(),
  participant_ids: z.array(BasecampIdSchema).optional(),
  all_day: z.boolean().optional(),
  notify: z.boolean().optional(),
});

export type ScheduleEntry = z.infer<typeof ScheduleEntrySchema>;
export type ScheduleEntryListQuery = z.infer<typeof ScheduleEntryListQuerySchema>;
export type ScheduleEntryCreateBody = z.infer<typeof ScheduleEntryCreateBodySchema>;
export type ScheduleEntryUpdateBody = z.infer<typeof ScheduleEntryUpdateBodySchema>;
export type RecurrenceSchedule = z.infer<typeof RecurrenceScheduleSchema>;
