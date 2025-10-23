import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

export const CampfireSchema = RecordingBaseSchema.extend({
  type: z.literal('Chat::Transcript'),
  topic: z.string(),
  lines_url: z.string().url(),
});

export const CampfireListResponseSchema = z.array(CampfireSchema);

export const CampfireListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const CampfireLineSchema = RecordingBaseSchema.extend({
  type: z.enum(['Chat::Lines::Text', 'Chat::Lines::RichText']),
  content: z.string(),
});

export const CampfireLineListResponseSchema = z.array(CampfireLineSchema);

export const CampfireLineListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const CampfireLineCreateBodySchema = z.object({
  content: z.string().min(1),
});

export type Campfire = z.infer<typeof CampfireSchema>;
export type CampfireLine = z.infer<typeof CampfireLineSchema>;
export type CampfireLineCreateBody = z.infer<typeof CampfireLineCreateBodySchema>;
