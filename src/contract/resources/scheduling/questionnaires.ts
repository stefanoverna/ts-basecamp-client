import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import { QuestionnaireSchema } from '../../schemas/scheduling/questionnaires';

const bucketAndQuestionnairePathParams = z.object({
  bucketId: BasecampIdParamSchema,
  questionnaireId: BasecampIdParamSchema,
});

export const questionnairesRouter = c.router({
  get: {
    summary: 'Get questionnaire',
    description:
      'Returns the questionnaire for a project. All automatic check-in questions are children of this resource.',
    metadata: {
      tag: 'Questionnaires',
      operationId: 'questionnaires.get',
      docsPath: '/docs/basecamp-api-specs/sections/questionnaires.md#get-questionnaire',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/questionnaires/:questionnaireId',
    pathParams: bucketAndQuestionnairePathParams,
    responses: {
      200: QuestionnaireSchema,
    },
  },
});

export type QuestionnairesRouter = typeof questionnairesRouter;
