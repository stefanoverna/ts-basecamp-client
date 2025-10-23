import { beforeAll, describe, expect, it } from 'vitest';

import { Client } from 'lib/basecamp/buildClient';
import {
  QuestionListResponseSchema,
  QuestionnaireSchema,
  QuestionSchema,
  ScheduleEntryListResponseSchema,
  ScheduleEntrySchema,
  ScheduleSchema,
} from '../contracts/basecamp/schemas/scheduling';
import { buildConfiguredClient, requireEnv } from './utils';

let client: Client;
let bucketId: number;
let scheduleId: number;
let questionnaireId: number;

beforeAll(async () => {
  bucketId = Number(requireEnv('BASECAMP_BUCKET_ID'));
  client = await buildConfiguredClient();
  scheduleId = await resolveScheduleId(client, bucketId);
  questionnaireId = await resolveQuestionnaireId(client, bucketId);
});

describe('Basecamp scheduling (live)', () => {
  it('manages schedules, entries, questionnaires, and questions lifecycle', async () => {
    // Test schedule operations
    const scheduleGetResponse = await client.schedules.get({
      params: {
        bucketId,
        scheduleId,
      },
    });

    expect(scheduleGetResponse.status).toBe(200);
    const schedule = ScheduleSchema.parse(scheduleGetResponse.body);

    // Update schedule to include due assignments
    const scheduleUpdateResponse = await client.schedules.update({
      params: {
        bucketId,
        scheduleId,
      },
      body: {
        include_due_assignments: !schedule.include_due_assignments,
      },
    });

    expect(scheduleUpdateResponse.status).toBe(200);
    const updatedSchedule = ScheduleSchema.parse(scheduleUpdateResponse.body);
    expect(updatedSchedule.include_due_assignments).toBe(!schedule.include_due_assignments);

    // Restore original setting
    await client.schedules.update({
      params: {
        bucketId,
        scheduleId,
      },
      body: {
        include_due_assignments: schedule.include_due_assignments,
      },
    });

    let scheduleEntryId: number | undefined;

    try {
      // List schedule entries
      const entriesListResponse = await client.scheduleEntries.list({
        params: {
          bucketId,
          scheduleId,
        },
      });

      expect(entriesListResponse.status).toBe(200);
      ScheduleEntryListResponseSchema.parse(entriesListResponse.body);

      // Create a schedule entry
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(11, 0, 0, 0);

      const entryCreateResponse = await client.scheduleEntries.create({
        params: {
          bucketId,
          scheduleId,
        },
        body: {
          summary: `Contract test entry ${Date.now()}`,
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrowEnd.toISOString(),
          description: '<div>This is a test schedule entry created by the contract suite.</div>',
        },
      });

      expect(entryCreateResponse.status).toBe(201);
      const createdEntry = ScheduleEntrySchema.parse(entryCreateResponse.body);
      scheduleEntryId = createdEntry.id;

      // Type assertion for subsequent operations
      if (scheduleEntryId === undefined)
        throw new Error('Schedule entry ID is required after creation');

      // Get the created entry
      const entryGetResponse = await client.scheduleEntries.get({
        params: {
          bucketId,
          scheduleEntryId,
        },
      });

      expect(entryGetResponse.status).toBe(200);
      ScheduleEntrySchema.parse(entryGetResponse.body);

      // Update the entry
      const entryUpdateResponse = await client.scheduleEntries.update({
        params: {
          bucketId,
          scheduleEntryId,
        },
        body: {
          summary: `Contract test entry ${Date.now()} (updated)`,
          all_day: true,
          starts_at: tomorrow.toISOString().split('T')[0],
          ends_at: tomorrow.toISOString().split('T')[0],
        },
      });

      expect(entryUpdateResponse.status).toBe(200);
      const updatedEntry = ScheduleEntrySchema.parse(entryUpdateResponse.body);
      expect(updatedEntry.summary).toContain('(updated)');
      expect(updatedEntry.all_day).toBe(true);
    } finally {
      // Clean up: trash the schedule entry
      if (scheduleEntryId !== undefined) {
        const trashEntryResponse = await client.scheduleEntries.trash({
          params: {
            bucketId,
            scheduleEntryId,
          },
        });
        expect(trashEntryResponse.status).toBe(204);
      }
    }

    // Test questionnaire operations
    const questionnaireGetResponse = await client.questionnaires.get({
      params: {
        bucketId,
        questionnaireId,
      },
    });

    expect(questionnaireGetResponse.status).toBe(200);
    QuestionnaireSchema.parse(questionnaireGetResponse.body);

    // Test questions operations
    const questionsListResponse = await client.questions.list({
      params: {
        bucketId,
        questionnaireId,
      },
    });

    expect(questionsListResponse.status).toBe(200);
    const questions = QuestionListResponseSchema.parse(questionsListResponse.body);

    if (questions.length > 0) {
      const firstQuestion = questions[0];

      // Get a specific question
      const questionGetResponse = await client.questions.get({
        params: {
          bucketId,
          questionId: firstQuestion.id,
        },
      });

      expect(questionGetResponse.status).toBe(200);
      QuestionSchema.parse(questionGetResponse.body);
    }
  }, 20000);
});

async function resolveScheduleId(client: Client, bucket: number): Promise<number> {
  const response = await client.projects.get({
    params: {
      projectId: bucket,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load project for schedule discovery (${response.status}).`);
  }

  const project = response.body;
  const dock = Array.isArray(project.dock) ? project.dock : [];
  const schedule = dock.find((entry) => entry.name === 'schedule' && entry.enabled !== false);

  if (!schedule) {
    throw new Error('Project does not expose a schedule in the dock.');
  }

  return schedule.id;
}

async function resolveQuestionnaireId(client: Client, bucket: number): Promise<number> {
  const response = await client.projects.get({
    params: {
      projectId: bucket,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load project for questionnaire discovery (${response.status}).`);
  }

  const project = response.body;
  const dock = Array.isArray(project.dock) ? project.dock : [];
  const questionnaire = dock.find(
    (entry) => entry.name === 'questionnaire' && entry.enabled !== false,
  );

  if (!questionnaire) {
    throw new Error('Project does not expose a questionnaire in the dock.');
  }

  return questionnaire.id;
}
