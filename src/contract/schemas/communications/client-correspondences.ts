import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

export const ClientCorrespondenceSchema = RecordingBaseSchema.extend({
  type: z.literal('Client::Correspondence'),
  content: HtmlStringSchema,
  subject: z.string(),
  replies_count: z.number().int().nonnegative(),
  replies_url: z.string().url(),
});

export const ClientCorrespondenceListResponseSchema = z.array(ClientCorrespondenceSchema);

export const ClientCorrespondenceListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type ClientCorrespondence = z.infer<typeof ClientCorrespondenceSchema>;
