import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  QuestionAnswerCreateBodySchema,
  QuestionAnswerListQuerySchema,
  QuestionAnswerListResponseSchema,
  QuestionAnswerSchema,
} from '../../schemas/scheduling/question-answers';

const bucketAndQuestionPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  questionId: BasecampIdParamSchema,
});

const bucketAndAnswerPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  answerId: BasecampIdParamSchema,
});

export const questionAnswersRouter = c.router({
  list: {
    summary: 'List question answers',
    description:
      'Returns a paginated list of answers for a specific check-in question.',
    metadata: {
      tag: 'Question Answers',
      operationId: 'questionAnswers.list',
      docsPath:
        '/docs/basecamp-api-specs/sections/question_answers.md#get-question-answers',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/questions/:questionId/answers',
    pathParams: bucketAndQuestionPathParams,
    query: QuestionAnswerListQuerySchema,
    responses: {
      200: QuestionAnswerListResponseSchema,
    },
  },
  get: {
    summary: 'Get a question answer',
    description: 'Returns a single question answer by its ID.',
    metadata: {
      tag: 'Question Answers',
      operationId: 'questionAnswers.get',
      docsPath:
        '/docs/basecamp-api-specs/sections/question_answers.md#get-a-question-answer',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/question_answers/:answerId',
    pathParams: bucketAndAnswerPathParams,
    responses: {
      200: QuestionAnswerSchema,
    },
  },
  create: {
    summary: 'Create a question answer',
    description: 'Create a new answer for a check-in question.',
    metadata: {
      tag: 'Question Answers',
      operationId: 'questionAnswers.create',
      docsPath:
        '/docs/basecamp-api-specs/sections/question_answers.md#get-question-answers',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/questions/:questionId/answers',
    pathParams: bucketAndQuestionPathParams,
    body: QuestionAnswerCreateBodySchema,
    responses: {
      201: QuestionAnswerSchema,
    },
  },
});

export type QuestionAnswersRouter = typeof questionAnswersRouter;
