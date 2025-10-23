import { z } from 'zod';

import { RecordingBaseSchema } from '../recordings';

export const VaultCoreSchema = RecordingBaseSchema.extend({
  type: z.literal('Vault'),
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
