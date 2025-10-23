import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingStatusSchema,
} from '../common';

export const InboxSchema = z.object({
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
  position: z.number().int().optional(),
  forwards_count: z.number().int().nonnegative().optional(),
  forwards_url: z.string().url().optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export type Inbox = z.infer<typeof InboxSchema>;
