import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

export const MessageBoardSchema = RecordingBaseSchema.extend({
  type: z.literal('Message::Board'),
  messages_count: z.number().int().nonnegative(),
  messages_url: z.string().url(),
  app_messages_url: z.string().url(),
});

export const MessageBoardsResponseSchema = z.array(MessageBoardSchema);

export type MessageBoard = z.infer<typeof MessageBoardSchema>;
export type MessageBoardsResponse = z.infer<typeof MessageBoardsResponseSchema>;
