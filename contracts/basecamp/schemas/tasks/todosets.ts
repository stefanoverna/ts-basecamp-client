import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

const TodoRecordingCoreSchema = z.object({
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
  comments_count: z.number().int().nonnegative().optional(),
  comments_url: z.string().url().optional(),
  position: z.number().int().nonnegative().optional(),
  parent: RecordingRefSchema.optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const TodoSetSchema = TodoRecordingCoreSchema.omit({
  subscription_url: true,
  comments_count: true,
  comments_url: true,
}).extend({
  completed: z.boolean(),
  completed_ratio: z.string(),
  name: z.string(),
  todolists_count: z.number().int().nonnegative(),
  todolists_url: z.string().url(),
  app_todoslists_url: z.string().url(),
});

export type TodoSet = z.infer<typeof TodoSetSchema>;
