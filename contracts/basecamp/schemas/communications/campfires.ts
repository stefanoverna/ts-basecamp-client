import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

export const CampfireSchema = z.object({
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
  position: z.number().int().optional(),
  topic: z.string(),
  lines_url: z.string().url(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const CampfireListResponseSchema = z.array(CampfireSchema);

export const CampfireListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const CampfireLineSchema = z.object({
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
  parent: RecordingRefSchema,
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
  content: z.string(),
});

export const CampfireLineListResponseSchema = z.array(CampfireLineSchema);

export const CampfireLineListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const CampfireLineCreateBodySchema = z.object({
  content: z.string().min(1),
});

export type Campfire = z.infer<typeof CampfireSchema>;
export type CampfireLine = z.infer<typeof CampfireLineSchema>;
export type CampfireLineCreateBody = z.infer<typeof CampfireLineCreateBodySchema>;
