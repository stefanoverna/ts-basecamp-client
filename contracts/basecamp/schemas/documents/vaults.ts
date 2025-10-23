import { z } from 'zod';

import {
  BasecampIdSchema,
  BucketRefSchema,
  IsoDateTimeSchema,
  PersonSummarySchema,
  RecordingRefSchema,
  RecordingStatusSchema,
} from '../common';

export const VaultCoreSchema = z.object({
  id: BasecampIdSchema,
  status: RecordingStatusSchema,
  visible_to_clients: z.boolean(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  title: z.string(),
  inherits_status: z.boolean(),
  type: z.literal('Vault'),
  url: z.string().url(),
  app_url: z.string().url(),
  bookmark_url: z.string().url(),
  position: z.number().int().nonnegative(),
  parent: RecordingRefSchema.optional(),
  bucket: BucketRefSchema,
  creator: PersonSummarySchema,
});

export const VaultSchema = VaultCoreSchema.extend({
  documents_count: z.number().int().nonnegative(),
  documents_url: z.string().url(),
  uploads_count: z.number().int().nonnegative(),
  uploads_url: z.string().url(),
  vaults_count: z.number().int().nonnegative(),
  vaults_url: z.string().url(),
});

export const VaultListResponseSchema = z.array(VaultSchema);

export const VaultListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const VaultCreateBodySchema = z.object({
  title: z.string().min(1),
});

export const VaultUpdateBodySchema = z.object({
  title: z.string().min(1),
});

export type Vault = z.infer<typeof VaultSchema>;
export type VaultListQuery = z.infer<typeof VaultListQuerySchema>;
export type VaultCreateBody = z.infer<typeof VaultCreateBodySchema>;
export type VaultUpdateBody = z.infer<typeof VaultUpdateBodySchema>;
