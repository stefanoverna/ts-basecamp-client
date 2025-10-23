import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from './common';

const KnownRecordingTypeSchema = z.enum([
  'Comment',
  'Document',
  'Kanban::Card',
  'Kanban::Step',
  'Message',
  'Question::Answer',
  'Schedule::Entry',
  'Todo',
  'Todolist',
  'Upload',
  'Vault',
]);

export const RecordingTypeSchema = KnownRecordingTypeSchema.or(z.string());

/**
 * Canonical Basecamp recording envelope shared across documents, tasks, schedules, etc.
 * Individual resources extend this schema to add domain-specific fields or tighten requirements.
 */
export const RecordingBaseSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.string(),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url().optional(),
  subscription_url: z.string().url().optional(),
  comments_count: z.number().int().nonnegative().optional(),
  comments_url: z.string().url().optional(),
  position: z.number().int().nonnegative().optional(),
  parent: RecordingRefSchema.optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const RecordingSummarySchema = z
  .object({
    id: BasecampIdSchema,
    type: z.string(),
    status: RecordingStatusSchema.optional(),
    title: z.string().optional(),
    created_at: IsoDateTimeSchema.optional(),
    updated_at: IsoDateTimeSchema.optional(),
    url: z.string().url(),
    app_url: z.string().url(),
    bucket: BucketRefSchema.optional(),
    parent: RecordingRefSchema.optional(),
    creator: PersonSummarySchema.optional(),
  })
  .passthrough();

export const RecordingListResponseSchema = z.array(RecordingSummarySchema);

export const RecordingListQuerySchema = z.object({
  type: RecordingTypeSchema,
  bucket: z.string().optional(),
  status: RecordingStatusSchema.optional(),
  sort: z.enum(['created_at', 'updated_at']).or(z.string()).optional(),
  direction: z.enum(['asc', 'desc']).or(z.string()).optional(),
  page: z.coerce.number().int().positive().optional(),
});

export type RecordingBase = z.infer<typeof RecordingBaseSchema>;
export type RecordingSummary = z.infer<typeof RecordingSummarySchema>;
export type RecordingListQuery = z.infer<typeof RecordingListQuerySchema>;
