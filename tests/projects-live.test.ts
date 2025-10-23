import { beforeAll, describe, expect, it } from 'vitest';

import { Client } from 'src/buildClient';
import { ProjectListResponseSchema, ProjectSchema } from '../src/contract/schemas/projects';
import { buildConfiguredClient, requireEnv } from './utils';

let client: Client;
let sandboxProjectId: number;

beforeAll(async () => {
  sandboxProjectId = Number(requireEnv('BASECAMP_BUCKET_ID'));
  client = await buildConfiguredClient();
});

describe('Basecamp projects (live)', () => {
  it('lists, creates, updates, and trashes a project', async () => {
    const listResponse = await client.projects.list({
      query: {},
    });

    expect(listResponse.status).toBe(200);
    ProjectListResponseSchema.parse(listResponse.body);

    const getResponse = await client.projects.get({
      params: {
        projectId: sandboxProjectId,
      },
    });

    expect(getResponse.status).toBe(200);
    const existingProject = ProjectSchema.parse(getResponse.body);
    expect(existingProject.id).toBe(sandboxProjectId);

    const nameBase = `Contract project smoke ${Date.now()}`;
    const createResponse = await client.projects.create({
      body: {
        name: nameBase,
        description: 'Project created by automated smoke test.',
      },
    });

    expect(createResponse.status).toBe(201);
    const createdProject = ProjectSchema.parse(createResponse.body);
    let projectId: number | undefined = createdProject.id;

    try {
      const updateResponse = await client.projects.update({
        params: {
          projectId,
        },
        body: {
          name: `${nameBase} (updated)`,
          description: 'Updated description for automated smoke test.',
        },
      });

      expect(updateResponse.status).toBe(200);
      const updatedProject = ProjectSchema.parse(updateResponse.body);
      expect(updatedProject.name).toContain('(updated)');

      const getUpdatedResponse = await client.projects.get({
        params: {
          projectId,
        },
      });

      expect(getUpdatedResponse.status).toBe(200);
      ProjectSchema.parse(getUpdatedResponse.body);
    } finally {
      if (projectId !== undefined) {
        const trashResponse = await client.projects.trash({
          params: {
            projectId,
          },
        });

        expect(trashResponse.status).toBe(204);
      }
    }
  });
});
