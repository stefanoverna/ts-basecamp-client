import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';
import { BasecampIdSchema, HtmlStringSchema, IsoDateSchema, PersonSummarySchema } from './common';
import { CardTableStepSchema } from './steps';

export const CardTableCardSchema = RecordingBaseSchema.extend({
  type: z.literal('Kanban::Card'),
  description: HtmlStringSchema.nullable().optional(),
  completed: z.boolean(),
  content: HtmlStringSchema.nullable().optional(),
  due_on: IsoDateSchema.nullable().optional(),
  comment_count: z.number().int().nonnegative().optional(),
  assignees: z.array(PersonSummarySchema),
  completion_subscribers: z.array(PersonSummarySchema),
  completion_url: z.string().min(1),
  steps: z.array(CardTableStepSchema).optional(),
});

export const CardTableCardListResponseSchema = z.array(CardTableCardSchema);

export const CardTableCardListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const CardTableCardCreateBodySchema = z.object({
  title: z.string().min(1),
  content: HtmlStringSchema.nullable().optional(),
  due_on: IsoDateSchema.optional(),
  notify: z.boolean().optional(),
  assignee_ids: z.array(BasecampIdSchema).optional(),
});

export const CardTableCardUpdateBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    content: HtmlStringSchema.nullable().optional(),
    due_on: IsoDateSchema.nullable().optional(),
    assignee_ids: z.array(BasecampIdSchema).optional(),
    notify: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.content !== undefined ||
      value.due_on !== undefined ||
      value.assignee_ids !== undefined ||
      value.notify !== undefined,
    {
      message: 'At least one field must be provided to update a card.',
    },
  );

export const CardTableCardMoveBodySchema = z.object({
  column_id: BasecampIdSchema,
  position: z.number().int().nonnegative().optional(),
});

export type CardTableCard = z.infer<typeof CardTableCardSchema>;
export type CardTableCardListResponse = z.infer<typeof CardTableCardListResponseSchema>;
export type CardTableCardListQuery = z.infer<typeof CardTableCardListQuerySchema>;
export type CardTableCardCreateBody = z.infer<typeof CardTableCardCreateBodySchema>;
export type CardTableCardUpdateBody = z.infer<typeof CardTableCardUpdateBodySchema>;
export type CardTableCardMoveBody = z.infer<typeof CardTableCardMoveBodySchema>;
