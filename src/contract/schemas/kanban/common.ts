import { z } from 'zod';

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

export type KanbanColumnColor = z.infer<typeof KanbanColumnColorSchema>;

export { BasecampIdSchema, BucketRefSchema, HtmlStringSchema, IsoDateSchema, IsoDateTimeSchema, PersonSummarySchema, RecordingRefSchema } from '../common';
