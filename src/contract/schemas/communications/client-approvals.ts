import { z } from 'zod';

import { HtmlStringSchema, IsoDateSchema, PersonSummarySchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

const ApprovalStatusEnum = z.enum(['pending', 'approved', 'rejected']).or(z.string());

export const ClientApprovalResponseSchema = RecordingBaseSchema.extend({
  type: z.literal('Client::Approval::Response'),
  content: HtmlStringSchema,
  approved: z.boolean().optional(),
});

export const ClientApprovalSchema = RecordingBaseSchema.extend({
  type: z.literal('Client::Approval'),
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
