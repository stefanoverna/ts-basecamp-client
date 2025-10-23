import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  QuestionListQuerySchema,
  QuestionListResponseSchema,
  QuestionSchema,
} from '../../schemas/scheduling/questions';

const bucketAndQuestionnairePathParams = z.object({
  bucketId: BasecampIdParamSchema,
  questionnaireId: BasecampIdParamSchema,
});

const bucketAndQuestionPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  questionId: BasecampIdParamSchema,
});

export const questionsRouter = c.router({
  list: {
    summary: 'List questions',
    description: 'Returns a paginated list of questions in a questionnaire (automatic check-ins).',
    metadata: {
      tag: 'Questions',
      operationId: 'questions.list',
      docsPath: '/docs/basecamp-api-specs/sections/questions.md#get-questions',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/questionnaires/:questionnaireId/questions',
    pathParams: bucketAndQuestionnairePathParams,
    query: QuestionListQuerySchema,
    responses: {
      200: QuestionListResponseSchema,
    },
  },
  get: {
    summary: 'Get a question',
    description: 'Returns a single automatic check-in question with its schedule and metadata.',
    metadata: {
      tag: 'Questions',
      operationId: 'questions.get',
      docsPath: '/docs/basecamp-api-specs/sections/questions.md#get-a-question',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/questions/:questionId',
    pathParams: bucketAndQuestionPathParams,
    responses: {
      200: QuestionSchema,
    },
  },
});

export type QuestionsRouter = typeof questionsRouter;
