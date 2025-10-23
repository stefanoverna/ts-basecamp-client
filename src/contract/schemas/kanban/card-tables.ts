import { z } from 'zod';

import { PersonSummarySchema } from './common';
import { CardTableColumnSchema } from './columns';
import { KanbanRecordingCoreSchema } from './common';

export const CardTableSchema = KanbanRecordingCoreSchema.extend({
  subscribers: z.array(PersonSummarySchema),
  public_link_url: z.string().url().optional(),
  lists: z.array(CardTableColumnSchema),
});

export type CardTable = z.infer<typeof CardTableSchema>;
