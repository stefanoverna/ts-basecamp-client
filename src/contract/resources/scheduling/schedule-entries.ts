import { z } from 'zod';

import { c } from '../../c';
import { BasecampIdParamSchema } from '../../schemas/common';
import {
  ScheduleEntryCreateBodySchema,
  ScheduleEntryListQuerySchema,
  ScheduleEntryListResponseSchema,
  ScheduleEntrySchema,
  ScheduleEntryUpdateBodySchema,
} from '../../schemas/scheduling/schedule-entries';

const bucketAndSchedulePathParams = z.object({
  bucketId: BasecampIdParamSchema,
  scheduleId: BasecampIdParamSchema,
});

const bucketAndEntryPathParams = z.object({
  bucketId: BasecampIdParamSchema,
  scheduleEntryId: BasecampIdParamSchema,
});

const bucketEntryOccurrencePathParams = z.object({
  bucketId: BasecampIdParamSchema,
  scheduleEntryId: BasecampIdParamSchema,
  occurrenceDate: z.string(),
});

export const scheduleEntriesRouter = c.router({
  list: {
    summary: 'List schedule entries',
    description:
      'Returns a paginated list of schedule entries in a schedule. Use status filter to get archived or trashed entries.',
    metadata: {
      tag: 'Schedule Entries',
      operationId: 'scheduleEntries.list',
      docsPath: '/docs/basecamp-api-specs/sections/schedule_entries.md#get-schedule-entries',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/schedules/:scheduleId/entries',
    pathParams: bucketAndSchedulePathParams,
    query: ScheduleEntryListQuerySchema,
    responses: {
      200: ScheduleEntryListResponseSchema,
    },
  },
  get: {
    summary: 'Get a schedule entry',
    description:
      'Returns a schedule entry. For recurring entries, this redirects to the first occurrence.',
    metadata: {
      tag: 'Schedule Entries',
      operationId: 'scheduleEntries.get',
      docsPath: '/docs/basecamp-api-specs/sections/schedule_entries.md#get-a-schedule-entry',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/schedule_entries/:scheduleEntryId',
    pathParams: bucketAndEntryPathParams,
    responses: {
      200: ScheduleEntrySchema,
    },
  },
  getOccurrence: {
    summary: 'Get a specific occurrence of a recurring schedule entry',
    description:
      'Returns a specific occurrence of a recurring schedule entry (e.g., 20190218 for February 18, 2019).',
    metadata: {
      tag: 'Schedule Entries',
      operationId: 'scheduleEntries.getOccurrence',
      docsPath: '/docs/basecamp-api-specs/sections/schedule_entries.md#get-a-schedule-entry',
    } as const,
    method: 'GET',
    path: '/buckets/:bucketId/schedule_entries/:scheduleEntryId/occurrences/:occurrenceDate',
    pathParams: bucketEntryOccurrencePathParams,
    responses: {
      200: ScheduleEntrySchema,
    },
  },
  create: {
    summary: 'Create a schedule entry',
    description:
      'Creates a new schedule entry in a schedule. Required fields: summary, starts_at, and ends_at.',
    metadata: {
      tag: 'Schedule Entries',
      operationId: 'scheduleEntries.create',
      docsPath: '/docs/basecamp-api-specs/sections/schedule_entries.md#create-a-schedule-entry',
    } as const,
    method: 'POST',
    path: '/buckets/:bucketId/schedules/:scheduleId/entries',
    pathParams: bucketAndSchedulePathParams,
    body: ScheduleEntryCreateBodySchema,
    responses: {
      201: ScheduleEntrySchema,
    },
  },
  update: {
    summary: 'Update a schedule entry',
    description: 'Updates an existing schedule entry. Any create parameters can be changed.',
    metadata: {
      tag: 'Schedule Entries',
      operationId: 'scheduleEntries.update',
      docsPath: '/docs/basecamp-api-specs/sections/schedule_entries.md#update-a-schedule-entry',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/schedule_entries/:scheduleEntryId',
    pathParams: bucketAndEntryPathParams,
    body: ScheduleEntryUpdateBodySchema,
    responses: {
      200: ScheduleEntrySchema,
    },
  },
  trash: {
    summary: 'Trash a schedule entry',
    description: 'Moves a schedule entry to the trash. Trashed items can be restored via the UI.',
    metadata: {
      tag: 'Schedule Entries',
      operationId: 'scheduleEntries.trash',
      docsPath: '/docs/basecamp-api-specs/sections/recordings.md#trash-a-recording',
    } as const,
    method: 'PUT',
    path: '/buckets/:bucketId/recordings/:scheduleEntryId/status/trashed',
    pathParams: bucketAndEntryPathParams,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type ScheduleEntriesRouter = typeof scheduleEntriesRouter;
