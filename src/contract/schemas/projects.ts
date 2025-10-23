import { z } from 'zod';

import { BasecampIdSchema, HtmlStringSchema, IsoDateTimeSchema } from './common';

const ProjectDockEntrySchema = z.object({
  id: BasecampIdSchema,
  title: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  position: z.number().int().nullable(),
  url: z.string().url(),
  app_url: z.string().url(),
});

const ProjectClientCompanySchema = z.object({
  id: BasecampIdSchema,
  name: z.string(),
});

const ProjectClientsideSchema = z.object({
  url: z.string().url(),
  app_url: z.string().url(),
});

export const ProjectStatusSchema = z.enum(['active', 'archived', 'trashed']).or(z.string());

export const ProjectCoreSchema = z.object({
  id: BasecampIdSchema,
  status: ProjectStatusSchema,
  created_at: IsoDateTimeSchema,
  updated_at: IsoDateTimeSchema,
  name: z.string(),
  description: HtmlStringSchema.nullable().optional(),
  purpose: z.string(),
  clients_enabled: z.boolean(),
  bookmark_url: z.string().url(),
  url: z.string().url(),
  app_url: z.string().url(),
  dock: z.array(ProjectDockEntrySchema),
  client_company: ProjectClientCompanySchema.optional(),
  clientside: ProjectClientsideSchema.optional(),
});

export const ProjectSchema = ProjectCoreSchema.extend({
  bookmarked: z.boolean().optional(),
});

export const ProjectListResponseSchema = z.array(ProjectSchema);

export const ProjectListQuerySchema = z.object({
  status: z.enum(['active', 'archived', 'trashed']).or(z.string()).optional(),
  page: z.coerce.number().int().positive().optional(),
});

export const ProjectCreateBodySchema = z.object({
  name: z.string().min(1),
  description: HtmlStringSchema.nullable().optional(),
});

const ScheduleAttributesSchema = z
  .object({
    start_date: z.string().date().optional(),
    end_date: z.string().date().optional(),
  })
  .refine(
    (value) =>
      (value.start_date === undefined && value.end_date === undefined) ||
      (value.start_date !== undefined && value.end_date !== undefined),
    {
      message: 'Both start_date and end_date must be provided together.',
      path: ['end_date'],
    },
  );

export const ProjectUpdateBodySchema = z.object({
  name: z.string().min(1),
  description: HtmlStringSchema.nullable().optional(),
  admissions: z.enum(['invite', 'employee', 'team']).or(z.string()).optional(),
  schedule_attributes: ScheduleAttributesSchema.optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
export type ProjectCreateBody = z.infer<typeof ProjectCreateBodySchema>;
export type ProjectUpdateBody = z.infer<typeof ProjectUpdateBodySchema>;
