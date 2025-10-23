import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

/**
 * Complete questionnaire resource.
 */
export const QuestionnaireSchema = RecordingBaseSchema.extend({
  type: z.literal('Questionnaire'),
  name: z.string(),
  questions_count: z.number().int(),
  questions_url: z.string().url(),
});

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
