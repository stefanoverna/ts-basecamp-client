import { z } from 'zod';

import { c } from '../c';
import { BasecampIdParamSchema } from '../schemas/common';
import {
  ProjectCreateBodySchema,
  ProjectListQuerySchema,
  ProjectListResponseSchema,
  ProjectSchema,
  ProjectUpdateBodySchema,
} from '../schemas/projects';

const ProjectPathParamsSchema = z.object({
  projectId: BasecampIdParamSchema,
});

export const projectsRouter = c.router({
  list: {
    summary: 'List projects',
    description:
      'Returns active projects visible to the authenticated user. Pagination data is exposed via standard Link headers.',
    metadata: {
      tag: 'Projects',
      operationId: 'projects.list',
      docsPath: '/docs/basecamp-api-specs/sections/projects.md#get-projects',
    } as const,
    method: 'GET',
    path: '/projects',
    query: ProjectListQuerySchema.optional(),
    responses: {
      200: ProjectListResponseSchema,
    },
  },
  get: {
    summary: 'Get a project',
    description: 'Fetch the full representation of a single project by its identifier.',
    metadata: {
      tag: 'Projects',
      operationId: 'projects.get',
      docsPath: '/docs/basecamp-api-specs/sections/projects.md#get-a-project',
    } as const,
    method: 'GET',
    path: '/projects/:projectId',
    pathParams: ProjectPathParamsSchema,
    responses: {
      200: ProjectSchema,
    },
  },
  create: {
    summary: 'Create a project',
    description: 'Create a new project with an optional description.',
    metadata: {
      tag: 'Projects',
      operationId: 'projects.create',
      docsPath: '/docs/basecamp-api-specs/sections/projects.md#create-a-project',
    } as const,
    method: 'POST',
    path: '/projects',
    body: ProjectCreateBodySchema,
    responses: {
      201: ProjectSchema,
      507: z.object({
        error: z.string(),
      }),
    },
  },
  update: {
    summary: 'Update a project',
    description:
      'Update a project name, description, admissions policy, or schedule dates. Basecamp requires the name to be present in every update request.',
    metadata: {
      tag: 'Projects',
      operationId: 'projects.update',
      docsPath: '/docs/basecamp-api-specs/sections/projects.md#update-a-project',
    } as const,
    method: 'PUT',
    path: '/projects/:projectId',
    pathParams: ProjectPathParamsSchema,
    body: ProjectUpdateBodySchema,
    responses: {
      200: ProjectSchema,
    },
  },
  trash: {
    summary: 'Trash a project',
    description:
      'Move a project to the trash. The project will be permanently deleted after 30 days unless restored via the UI.',
    metadata: {
      tag: 'Projects',
      operationId: 'projects.trash',
      docsPath: '/docs/basecamp-api-specs/sections/projects.md#trash-a-project',
    } as const,
    method: 'DELETE',
    path: '/projects/:projectId',
    pathParams: ProjectPathParamsSchema,
    body: c.noBody(),
    responses: {
      204: c.noBody(),
    },
  },
});

export type ProjectsRouter = typeof projectsRouter;
