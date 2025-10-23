import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

export const ForwardSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.string(),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url().optional(),
  subscription_url: z.string().url().optional(),
  parent: RecordingRefSchema,
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
  content: z.string(),
  subject: z.string(),
  from: z.string().nullable().optional(),
  replies_count: z.number().int().nonnegative(),
  replies_url: z.string().url(),
});

export const ForwardListResponseSchema = z.array(ForwardSchema);

export const ForwardListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type Forward = z.infer<typeof ForwardSchema>;
export type ForwardListQuery = z.infer<typeof ForwardListQuerySchema>;
