import { beforeAll, describe, expect, it } from 'vitest';

import { Client } from 'src/buildClient';
import { MessageSchema } from '../src/contract/schemas/communications/messages';
import { RecordingEventListResponseSchema } from '../src/contract/schemas/events';
import {
  PeopleListResponseSchema,
  PersonSchema,
  ProjectPeopleAccessResponseSchema,
} from '../src/contract/schemas/people';
import { ProjectListResponseSchema, ProjectSchema } from '../src/contract/schemas/projects';
import { RecordingListResponseSchema } from '../src/contract/schemas/recordings';
import { buildConfiguredClient, requireEnv } from './utils';

let client: Client;
let bucketId: number;
let messageBoardId: number;

beforeAll(async () => {
  bucketId = Number(requireEnv('BASECAMP_BUCKET_ID'));

  client = await buildConfiguredClient();
  messageBoardId = await resolveMessageBoardId(client, bucketId);
});

describe('Basecamp core resources (live)', () => {
  it('lists and fetches projects', async () => {
    const projectsListResponse = await client.projects.list({
      query: {},
    });
    expect(projectsListResponse.status).toBe(200);
    const projects = ProjectListResponseSchema.parse(projectsListResponse.body);

    const projectId = projects[0]?.id ?? bucketId;

    const projectGetResponse = await client.projects.get({
      params: {
        projectId,
      },
    });
    expect(projectGetResponse.status).toBe(200);
    ProjectSchema.parse(projectGetResponse.body);
  }, 20000);

  it('manages people access flows', async () => {
    const peopleListResponse = await client.people.list({
      query: {},
    });
    expect(peopleListResponse.status).toBe(200);
    const people = PeopleListResponseSchema.parse(peopleListResponse.body);
    expect(people.length).toBeGreaterThan(0);

    const projectPeopleResponse = await client.people.listForProject({
      params: {
        projectId: bucketId,
      },
    });
    expect(projectPeopleResponse.status).toBe(200);
    PeopleListResponseSchema.parse(projectPeopleResponse.body);

    const meResponse = await client.people.me({});
    expect(meResponse.status).toBe(200);
    const me = PersonSchema.parse(meResponse.body);

    const getMeResponse = await client.people.get({
      params: {
        personId: me.id,
      },
    });
    expect(getMeResponse.status).toBe(200);
    PersonSchema.parse(getMeResponse.body);

    const pingableResponse = await client.people.listPingable({});
    expect(pingableResponse.status).toBe(200);
    PeopleListResponseSchema.parse(pingableResponse.body);

    const accessResponse = await client.people.updateProjectAccess({
      params: {
        projectId: bucketId,
      },
      body: {
        grant: [me.id],
      },
    });
    expect(accessResponse.status).toBe(200);
    ProjectPeopleAccessResponseSchema.parse(accessResponse.body);
  }, 20000);

  it('performs message and recording lifecycle operations', async () => {
    const messageSubject = `Contract message ${Date.now()}`;
    let messageId: number | undefined;

    try {
      const messageCreateResponse = await client.messages.create({
        params: {
          bucketId,
          messageBoardId,
        },
        body: {
          subject: messageSubject,
          content: '<div>Automated message for core contract smoke test.</div>',
          status: 'active',
        },
      });
      expect(messageCreateResponse.status).toBe(201);
      const createdMessage = MessageSchema.parse(messageCreateResponse.body);
      messageId = createdMessage.id;

      const messageUpdateResponse = await client.messages.update({
        params: {
          bucketId,
          messageId,
        },
        body: {
          subject: `${messageSubject} (updated)`,
        },
      });
      expect(messageUpdateResponse.status).toBe(200);
      MessageSchema.parse(messageUpdateResponse.body);

      const recordingsListResponse = await client.recordings.list({
        query: {
          type: 'Message',
          bucket: String(bucketId),
          status: 'active',
        },
      });
      expect(recordingsListResponse.status).toBe(200);
      const recordings = RecordingListResponseSchema.parse(recordingsListResponse.body);
      expect(recordings.some((recording) => recording.id === messageId)).toBe(true);

      const eventsResponse = await client.events.listForRecording({
        params: {
          bucketId,
          recordingId: messageId,
        },
        query: {},
      });
      expect(eventsResponse.status).toBe(200);
      const events = RecordingEventListResponseSchema.parse(eventsResponse.body);
      expect(events.length).toBeGreaterThan(0);

      const archiveResponse = await client.recordings.archive({
        params: {
          bucketId,
          recordingId: messageId,
        },
      });
      expect(archiveResponse.status).toBe(204);

      const activateResponse = await client.recordings.activate({
        params: {
          bucketId,
          recordingId: messageId,
        },
      });
      expect(activateResponse.status).toBe(204);

      const trashResponse = await client.recordings.trash({
        params: {
          bucketId,
          recordingId: messageId,
        },
      });
      expect(trashResponse.status).toBe(204);
    } finally {
      if (messageId !== undefined) {
        await client.messages.trash({
          params: {
            bucketId,
            messageId,
          },
        });
      }
    }
  }, 20000);
});

async function resolveMessageBoardId(client: Client, bucket: number): Promise<number> {
  const response = await client.projects.get({
    params: {
      projectId: bucket,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load project for message board discovery (${response.status}).`);
  }

  const project = ProjectSchema.parse(response.body);
  const dock = Array.isArray(project.dock) ? project.dock : [];
  const messageBoard = dock.find(
    (entry) => entry.name === 'message_board' && entry.enabled !== false,
  );

  if (!messageBoard) {
    throw new Error('Project does not expose a message board in the dock.');
  }

  return messageBoard.id;
}
