import { z } from 'zod';

/**
 * Numeric identifier used across Basecamp resources.
 */
export const BasecampIdSchema = z.number().int().nonnegative();

/**
 * Path parameter helper accepting numeric strings and coercing to numbers.
 */
export const BasecampIdParamSchema = z.coerce.number().int().nonnegative();

/**
 * ISO8601 timestamp with timezone offset (e.g. 2022-11-22T10:46:58.169Z).
 */
export const IsoDateTimeSchema = z.string().datetime({ offset: true });

/**
 * ISO8601 calendar date without a time component (e.g. 2022-11-22).
 */
export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD');

/**
 * Base recording status – the API currently surfaces "active" and "trashed",
 * but we allow unknown values to keep forward compatibility.
 */
export const RecordingStatusSchema = z.enum(['active', 'trashed']).or(z.string());

/**
 * Rich text content rendered as HTML.
 */
export const HtmlStringSchema = z.string().min(0);

export const BucketRefSchema = z.object({
  id: BasecampIdSchema,
  name: z.string(),
  type: z.string(),
});

export const RecordingRefSchema = z.object({
  id: BasecampIdSchema,
  title: z.string(),
  type: z.string(),
  url: z.string().url(),
  app_url: z.string().url(),
});

export const PersonSummarySchema = z.object({
  id: BasecampIdSchema,
  attachable_sgid: z.string().min(1),
  name: z.string(),
  email_address: z.string().email().nullable(),
  personable_type: z.string(),
  title: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  admin: z.boolean(),
  owner: z.boolean(),
  client: z.boolean(),
  employee: z.boolean(),
  time_zone: z.string(),
  avatar_url: z.string().url(),
  company: z
    .object({
      id: BasecampIdSchema,
      name: z.string(),
    })
    .optional(),
  can_manage_projects: z.boolean(),
  can_manage_people: z.boolean(),
});

export type BasecampId = z.infer<typeof BasecampIdSchema>;
