import { z } from 'zod';

import { BasecampIdSchema, IsoDateTimeSchema, PersonSummarySchema } from './common';

export const EventDetailsSchema = z.object({}).passthrough();

export const RecordingEventSchema = z.object({
  id: BasecampIdSchema,
  recording_id: BasecampIdSchema,
  action: z.string(),
  details: EventDetailsSchema,
  created_at: IsoDateTimeSchema,
  creator: PersonSummarySchema,
});

export const RecordingEventListResponseSchema = z.array(RecordingEventSchema);

export const RecordingEventListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type RecordingEvent = z.infer<typeof RecordingEventSchema>;
export type RecordingEventListQuery = z.infer<typeof RecordingEventListQuerySchema>;
