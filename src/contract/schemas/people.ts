import { z } from 'zod';

import { BasecampIdSchema, PersonSummarySchema } from './common';

export const PersonSchema = PersonSummarySchema;

export const PeopleListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const PeopleListResponseSchema = z.array(PersonSchema);

const ProjectAccessCreateEntrySchema = z.object({
  name: z.string().min(1),
  email_address: z.string().email(),
  title: z.string().optional(),
  company_name: z.string().optional(),
});

export const ProjectPeopleAccessBodySchema = z
  .object({
    grant: z.array(BasecampIdSchema).min(1).optional(),
    revoke: z.array(BasecampIdSchema).min(1).optional(),
    create: z.array(ProjectAccessCreateEntrySchema).min(1).optional(),
  })
  .refine(
    (value) =>
      value.grant !== undefined || value.revoke !== undefined || value.create !== undefined,
    {
      message: 'At least one of grant, revoke, or create must be provided.',
      path: ['grant'],
    },
  );

export const ProjectPeopleAccessResponseSchema = z.object({
  granted: z.array(PersonSchema),
  revoked: z.array(PersonSchema),
});

export type Person = z.infer<typeof PersonSchema>;
export type PeopleListQuery = z.infer<typeof PeopleListQuerySchema>;
export type ProjectPeopleAccessBody = z.infer<typeof ProjectPeopleAccessBodySchema>;
export type ProjectPeopleAccessResponse = z.infer<typeof ProjectPeopleAccessResponseSchema>;
