import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingStatusSchema,
} from '../common';

/**
 * Complete questionnaire resource.
 */
export const QuestionnaireSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.literal('Questionnaire'),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
  name: z.string(),
  questions_count: z.number().int(),
  questions_url: z.string().url(),
});

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
