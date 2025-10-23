import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  HtmlStringSchema,
  IsoDateSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

const ApprovalStatusEnum = z.enum(['pending', 'approved', 'rejected']).or(z.string());

export const ClientApprovalResponseSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.string(),
  url: z.string().url().optional(),
  app_url: z.string().url(),
  bookmark_url: z.string().url().optional(),
  parent: RecordingRefSchema,
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
  content: HtmlStringSchema,
  approved: z.boolean().optional(),
});

export const ClientApprovalSchema = z.object({
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
  parent: RecordingRefSchema,
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
  content: HtmlStringSchema,
  subject: z.string(),
  due_on: IsoDateSchema.nullable(),
  replies_count: z.number().int().nonnegative(),
  replies_url: z.string().url(),
  approval_status: ApprovalStatusEnum,
  approver: PersonSummarySchema.optional(),
  responses: z.array(ClientApprovalResponseSchema).optional(),
});

export const ClientApprovalListResponseSchema = z.array(ClientApprovalSchema);

export const ClientApprovalListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export type ClientApproval = z.infer<typeof ClientApprovalSchema>;
export type ClientApprovalResponse = z.infer<typeof ClientApprovalResponseSchema>;
