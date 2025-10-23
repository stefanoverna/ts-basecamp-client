import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  HtmlStringSchema,
  IsoDateSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

export const KanbanRecordingCoreSchema = z.object({
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
  position: z.number().int().nonnegative().optional(),
  parent: RecordingRefSchema.optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const KanbanColumnColorSchema = z
  .enum([
    'white',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'aqua',
    'purple',
    'gray',
    'pink',
    'brown',
  ])
  .or(z.string());

export type KanbanRecordingCore = z.infer<typeof KanbanRecordingCoreSchema>;
export type KanbanColumnColor = z.infer<typeof KanbanColumnColorSchema>;

export {
  BasecampIdSchema,
  BucketRefSchema,
  HtmlStringSchema,
  IsoDateSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
};
