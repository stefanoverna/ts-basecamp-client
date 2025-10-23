import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

/**
 * Complete schedule resource with all metadata.
 */
export const ScheduleSchema = RecordingBaseSchema.extend({
  type: z.literal('Schedule'),
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
