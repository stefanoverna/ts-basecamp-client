import { z } from 'zod';

import { RecordingSummarySchema } from '../recordings';

export const ClientVisibilityUpdateBodySchema = z.object({
  visible_to_clients: z.boolean(),
});

export const ClientVisibilityRecordingSchema = RecordingSummarySchema.extend({
  visible_to_clients: z.boolean().optional(),
});

export type ClientVisibilityUpdateBody = z.infer<typeof ClientVisibilityUpdateBodySchema>;
