import { z } from 'zod';

import { BasecampIdSchema, IsoDateTimeSchema } from '../common';

export const MessageTypeSchema = z.object({
  id: BasecampIdSchema,
  name: z.string(),
  icon: z.string(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
});

export const MessageTypesResponseSchema = z.array(MessageTypeSchema);

export const MessageTypeCreateBodySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
});

export const MessageTypeUpdateBodySchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
});

export type MessageType = z.infer<typeof MessageTypeSchema>;
export type MessageTypesResponse = z.infer<typeof MessageTypesResponseSchema>;
export type MessageTypeCreateBody = z.infer<typeof MessageTypeCreateBodySchema>;
export type MessageTypeUpdateBody = z.infer<typeof MessageTypeUpdateBodySchema>;
