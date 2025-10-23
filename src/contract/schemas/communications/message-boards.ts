import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

const MessageBoardRecordingCoreSchema = z.object({
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
  position: z.number().int().nonnegative().optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const MessageBoardSchema = MessageBoardRecordingCoreSchema.extend({
  messages_count: z.number().int().nonnegative(),
  messages_url: z.string().url(),
  app_messages_url: z.string().url(),
});

export const MessageBoardsResponseSchema = z.array(MessageBoardSchema);

export type MessageBoard = z.infer<typeof MessageBoardSchema>;
export type MessageBoardsResponse = z.infer<typeof MessageBoardsResponseSchema>;
