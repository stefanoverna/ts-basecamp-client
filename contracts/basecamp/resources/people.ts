import { z } from 'zod';

import { c } from '../c';
import { BasecampIdParamSchema } from '../schemas/common';
import {
  PeopleListQuerySchema,
  PeopleListResponseSchema,
  PersonSchema,
  ProjectPeopleAccessBodySchema,
  ProjectPeopleAccessResponseSchema,
} from '../schemas/people';

const ProjectPathParamsSchema = z.object({
  projectId: BasecampIdParamSchema,
});

const PersonPathParamsSchema = z.object({
  personId: BasecampIdParamSchema,
});

export const peopleRouter = c.router({
  list: {
    summary: 'List people',
    description:
      'Returns the people visible to the authenticated user across the entire Basecamp account. Pagination data is provided through Link headers when the dataset exceeds a single page.',
    metadata: {
      tag: 'People',
      operationId: 'people.list',
      docsPath: '/docs/basecamp-api-specs/sections/people.md#get-all-people',
    } as const,
    method: 'GET',
    path: '/people',
    query: PeopleListQuerySchema.optional(),
    responses: {
      200: PeopleListResponseSchema,
    },
  },
  listForProject: {
    summary: 'List project people',
    description: 'Returns the active people on a specific project.',
    metadata: {
      tag: 'People',
      operationId: 'people.listForProject',
      docsPath: '/docs/basecamp-api-specs/sections/people.md#get-people-on-a-project',
    } as const,
    method: 'GET',
    path: '/projects/:projectId/people',
    pathParams: ProjectPathParamsSchema,
    responses: {
      200: PeopleListResponseSchema,
    },
  },
  updateProjectAccess: {
    summary: 'Update project access',
    description:
      'Grant, revoke, or create people directly on a project. At least one of grant, revoke, or create must be present in the request body.',
    metadata: {
      tag: 'People',
      operationId: 'people.updateProjectAccess',
      docsPath: '/docs/basecamp-api-specs/sections/people.md#update-who-can-access-a-project',
    } as const,
    method: 'PUT',
    path: '/projects/:projectId/people/users',
    pathParams: ProjectPathParamsSchema,
    body: ProjectPeopleAccessBodySchema,
    responses: {
      200: ProjectPeopleAccessResponseSchema,
    },
  },
  listPingable: {
    summary: 'List pingable people',
    description:
      'Returns the people who can be pinged by the authenticated user. The endpoint is not paginated.',
    metadata: {
      tag: 'People',
      operationId: 'people.listPingable',
      docsPath: '/docs/basecamp-api-specs/sections/people.md#get-pingable-people',
    } as const,
    method: 'GET',
    path: '/circles/people',
    responses: {
      200: PeopleListResponseSchema,
    },
  },
  get: {
    summary: 'Get a person',
    description: 'Fetch the profile for a person by identifier.',
    metadata: {
      tag: 'People',
      operationId: 'people.get',
      docsPath: '/docs/basecamp-api-specs/sections/people.md#get-person',
    } as const,
    method: 'GET',
    path: '/people/:personId',
    pathParams: PersonPathParamsSchema,
    responses: {
      200: PersonSchema,
    },
  },
  me: {
    summary: 'Get my personal info',
    description: 'Fetch the profile for the authenticated user.',
    metadata: {
      tag: 'People',
      operationId: 'people.me',
      docsPath: '/docs/basecamp-api-specs/sections/people.md#get-my-personal-info',
    } as const,
    method: 'GET',
    path: '/my/profile',
    responses: {
      200: PersonSchema,
    },
  },
});

export type PeopleRouter = typeof peopleRouter;
