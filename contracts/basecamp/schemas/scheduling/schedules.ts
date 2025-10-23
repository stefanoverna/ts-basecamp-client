import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingStatusSchema,
} from '../common';

/**
 * Complete schedule resource with all metadata.
 */
export const ScheduleSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.literal('Schedule'),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url(),
  position: z.number().int(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
  include_due_assignments: z.boolean(),
  entries_count: z.number().int(),
  entries_url: z.string().url(),
});

/**
 * Request body for updating a schedule.
 */
export const ScheduleUpdateBodySchema = z.object({
  include_due_assignments: z.boolean(),
});

export type Schedule = z.infer<typeof ScheduleSchema>;
export type ScheduleUpdateBody = z.infer<typeof ScheduleUpdateBodySchema>;
