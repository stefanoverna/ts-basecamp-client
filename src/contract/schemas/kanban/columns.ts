import { z } from 'zod';

import {
  BasecampIdSchema,
  HtmlStringSchema,
  KanbanColumnColorSchema,
  KanbanRecordingCoreSchema,
  PersonSummarySchema,
} from './common';

export const CardTableColumnSchema = KanbanRecordingCoreSchema.extend({
  description: HtmlStringSchema.nullable().optional(),
  subscribers: z.array(PersonSummarySchema),
  color: KanbanColumnColorSchema.nullable().optional(),
  cards_count: z.number().int().nonnegative().optional(),
  comment_count: z.number().int().nonnegative().optional(),
  cards_url: z.string().url(),
  on_hold: z.unknown().optional(),
});

export const CardTableColumnCreateBodySchema = z.object({
  title: z.string().min(1),
  description: HtmlStringSchema.nullable().optional(),
});

export const CardTableColumnUpdateBodySchema = CardTableColumnCreateBodySchema.partial().refine(
  (value) => value.title !== undefined || value.description !== undefined,
  {
    message: 'At least one field must be provided to update a column.',
  },
);

export const CardTableColumnMoveBodySchema = z.object({
  source_id: BasecampIdSchema,
  target_id: BasecampIdSchema,
  position: z.number().int().positive().optional(),
});

export const CardTableColumnColorBodySchema = z.object({
  color: KanbanColumnColorSchema,
});

export type CardTableColumn = z.infer<typeof CardTableColumnSchema>;
export type CardTableColumnCreateBody = z.infer<typeof CardTableColumnCreateBodySchema>;
export type CardTableColumnUpdateBody = z.infer<typeof CardTableColumnUpdateBodySchema>;
export type CardTableColumnMoveBody = z.infer<typeof CardTableColumnMoveBodySchema>;
export type CardTableColumnColorBody = z.infer<typeof CardTableColumnColorBodySchema>;
