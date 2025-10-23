import { z } from 'zod';

import {
  BasecampIdSchema,
  HtmlStringSchema,
  IsoDateSchema,
  KanbanRecordingCoreSchema,
  PersonSummarySchema,
} from './common';

export const CardTableStepSchema = KanbanRecordingCoreSchema.extend({
  completed: z.boolean(),
  due_on: IsoDateSchema.nullable().optional(),
  assignees: z.array(PersonSummarySchema),
  completion_url: z.string().min(1),
  completion_subscribers: z.array(PersonSummarySchema).optional(),
  description: HtmlStringSchema.nullable().optional(),
});

export const CardTableStepCreateBodySchema = z.object({
  title: z.string().min(1),
  due_on: IsoDateSchema.optional(),
  assignees: z.string().optional(),
});

export const CardTableStepUpdateBodySchema = CardTableStepCreateBodySchema.partial().refine(
  (value) =>
    value.title !== undefined || value.due_on !== undefined || value.assignees !== undefined,
  {
    message: 'At least one field must be provided to update a step.',
  },
);

export const CardTableStepCompletionBodySchema = z.object({
  completion: z.enum(['on', 'off']),
});

export const CardTableStepRepositionBodySchema = z.object({
  source_id: BasecampIdSchema,
  position: z.number().int().nonnegative(),
});

export type CardTableStep = z.infer<typeof CardTableStepSchema>;
export type CardTableStepCreateBody = z.infer<typeof CardTableStepCreateBodySchema>;
export type CardTableStepUpdateBody = z.infer<typeof CardTableStepUpdateBodySchema>;
export type CardTableStepCompletionBody = z.infer<typeof CardTableStepCompletionBodySchema>;
export type CardTableStepRepositionBody = z.infer<typeof CardTableStepRepositionBodySchema>;
