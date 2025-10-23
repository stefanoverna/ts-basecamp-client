import { z } from 'zod';

import { HtmlStringSchema } from '../common';
import { RecordingBaseSchema } from '../recordings';

export const UploadCoreSchema = RecordingBaseSchema.extend({
  type: z.literal('Upload'),
});

export const UploadSchema = UploadCoreSchema.extend({
  description: HtmlStringSchema.optional(),
  content_type: z.string(),
  byte_size: z.number().int().nonnegative(),
  filename: z.string(),
  download_url: z.string().url(),
  app_download_url: z.string().url(),
  width: z.number().int().nonnegative().optional(),
  height: z.number().int().nonnegative().optional(),
});

export const UploadListResponseSchema = z.array(UploadSchema);

export const UploadListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const UploadCreateBodySchema = z.object({
  attachable_sgid: z.string().min(1),
  description: HtmlStringSchema.optional(),
  base_name: z.string().optional(),
});

export const UploadUpdateBodySchema = z
  .object({
    description: HtmlStringSchema.optional(),
    base_name: z.string().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one field must be provided to update an upload.',
  );

export type Upload = z.infer<typeof UploadSchema>;
export type UploadListQuery = z.infer<typeof UploadListQuerySchema>;
export type UploadCreateBody = z.infer<typeof UploadCreateBodySchema>;
export type UploadUpdateBody = z.infer<typeof UploadUpdateBodySchema>;
