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

export const ClientCorrespondenceSchema = z.object({
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
