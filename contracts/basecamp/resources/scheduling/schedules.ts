import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import { ScheduleSchema, ScheduleUpdateBodySchema } from '../../schemas/scheduling/schedules';

const bucketAndSchedulePathParams = z.object({
  bucketId: BasecampIdParamSchema,
  scheduleId: BasecampIdParamSchema,
});

export const schedulesRouter = c.router({
  get: {
    summary: 'Get schedule',
    description:
      'Returns the schedule for a project. All schedule entries under a project are children of this resource.',
    metadata: {
      tag: 'Schedules',
      operationId: 'schedules.get',
      docsPath: '/docs/basecamp-api-specs/sections/schedules.md#get-schedule',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/schedules/:scheduleId',
    pathParams: bucketAndSchedulePathParams,
    responses: {
      200: ScheduleSchema,
    },
  },
  update: {
    summary: 'Update a schedule',
    description:
      'Update whether the schedule should include due dates from to-dos, cards, and steps.',
    metadata: {
      tag: 'Schedules',
      operationId: 'schedules.update',
      docsPath: '/docs/basecamp-api-specs/sections/schedules.md#update-a-schedule',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/schedules/:scheduleId',
    pathParams: bucketAndSchedulePathParams,
    body: ScheduleUpdateBodySchema,
    responses: {
      200: ScheduleSchema,
    },
  },
});

export type SchedulesRouter = typeof schedulesRouter;
