import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';
import { PersonSummarySchema } from './common';
import { CardTableColumnSchema } from './columns';

export const CardTableSchema = RecordingBaseSchema.extend({
  type: z.literal('Kanban::Board'),
  subscribers: z.array(PersonSummarySchema),
  public_link_url: z.string().url().optional(),
  lists: z.array(CardTableColumnSchema),
});

export type CardTable = z.infer<typeof CardTableSchema>;
