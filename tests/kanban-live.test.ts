import { beforeAll, describe, expect, it } from 'vitest';

import { Client } from 'src/buildClient';
import {
  CardTableSchema,
  CardTableCardSchema,
  CardTableColumnSchema,
  CardTableStepSchema,
} from '../src/contract/schemas/kanban';
import { ProjectSchema } from '../src/contract/schemas/projects';
import { buildConfiguredClient, requireEnv } from './utils';

let client: Client;
let bucketId: number;
let cardTableId: number;

beforeAll(async () => {
  bucketId = Number(requireEnv('BASECAMP_BUCKET_ID'));
  client = await buildConfiguredClient();
  cardTableId = await resolveCardTableId(client, bucketId);
});

describe('Basecamp card tables (live)', () => {
  it('manages card table columns, cards, and steps', async () => {
    const cardTableResponse = await client.cardTables.get({
      params: {
        bucketId,
        cardTableId,
      },
    });

    expect(cardTableResponse.status).toBe(200);
    const cardTable = CardTableSchema.parse(cardTableResponse.body);
    const destinationColumnId = cardTable.lists[0]?.id;
    expect(destinationColumnId).toBeDefined();

    const columnNameBase = `Contract column ${Date.now()}`;
    const columnCreateResponse = await client.cardTableColumns.create({
      params: {
        bucketId,
        cardTableId,
      },
      body: {
        title: columnNameBase,
        description: '<div>Automated column for kanban contract test.</div>',
      },
    });

    expect(columnCreateResponse.status).toBe(201);
    const createdColumn = CardTableColumnSchema.parse(columnCreateResponse.body);
    const columnId = createdColumn.id;

    let cardId: number | undefined;
    let stepId: number | undefined;

    try {
      const columnUpdateResponse = await client.cardTableColumns.update({
        params: {
          bucketId,
          columnId,
        },
        body: {
          description: '<div>Updated automated column description.</div>',
        },
      });

      expect(columnUpdateResponse.status).toBe(200);
      CardTableColumnSchema.parse(columnUpdateResponse.body);

      const columnMoveResponse = await client.cardTableColumns.move({
        params: {
          bucketId,
          cardTableId,
        },
        body: {
          source_id: columnId,
          target_id: cardTableId,
          position: 2,
        },
      });

      expect(columnMoveResponse.status).toBe(204);

      const columnColorResponse = await client.cardTableColumns.updateColor({
        params: {
          bucketId,
          columnId,
        },
        body: {
          color: 'blue',
        },
      });

      expect(columnColorResponse.status).toBe(200);
      CardTableColumnSchema.parse(columnColorResponse.body);

      const columnOnHoldResponse = await client.cardTableColumns.enableOnHold({
        params: {
          bucketId,
          columnId,
        },
      });

      expect(columnOnHoldResponse.status).toBe(200);
      CardTableColumnSchema.parse(columnOnHoldResponse.body);

      const columnRemoveOnHoldResponse = await client.cardTableColumns.disableOnHold({
        params: {
          bucketId,
          columnId,
        },
      });

      expect(columnRemoveOnHoldResponse.status).toBe(200);
      CardTableColumnSchema.parse(columnRemoveOnHoldResponse.body);

      const cardTitleBase = `Contract card ${Date.now()}`;
      const cardCreateResponse = await client.cardTableCards.create({
        params: {
          bucketId,
          columnId,
        },
        body: {
          title: cardTitleBase,
          content: '<div>Automated card for kanban contract test.</div>',
        },
      });

      expect(cardCreateResponse.status).toBe(201);
      const createdCard = CardTableCardSchema.parse(cardCreateResponse.body);
      cardId = createdCard.id;

      const cardUpdateResponse = await client.cardTableCards.update({
        params: {
          bucketId,
          cardId,
        },
        body: {
          content: '<div>Updated automated card for kanban contract test.</div>',
        },
      });

      expect(cardUpdateResponse.status).toBe(200);
      CardTableCardSchema.parse(cardUpdateResponse.body);

      if (destinationColumnId !== undefined) {
        const cardMoveResponse = await client.cardTableCards.move({
          params: {
            bucketId,
            cardId,
          },
          body: {
            column_id: destinationColumnId,
            position: 0,
          },
        });

        expect(cardMoveResponse.status).toBe(204);
      }

      const stepCreateResponse = await client.cardTableSteps.create({
        params: {
          bucketId,
          cardId,
        },
        body: {
          title: 'Review requirements',
        },
      });

      expect(stepCreateResponse.status).toBe(201);
      const createdStep = CardTableStepSchema.parse(stepCreateResponse.body);
      stepId = createdStep.id;

      const stepUpdateResponse = await client.cardTableSteps.update({
        params: {
          bucketId,
          stepId,
        },
        body: {
          title: 'Review updated requirements',
        },
      });

      expect(stepUpdateResponse.status).toBe(200);
      CardTableStepSchema.parse(stepUpdateResponse.body);

      const stepCompleteResponse = await client.cardTableSteps.setCompletion({
        params: {
          bucketId,
          stepId,
        },
        body: {
          completion: 'on',
        },
      });

      expect(stepCompleteResponse.status).toBe(200);
      const completedStep = CardTableStepSchema.parse(stepCompleteResponse.body);
      expect(completedStep.completed).toBe(true);

      const stepRepositionResponse = await client.cardTableSteps.reposition({
        params: {
          bucketId,
          cardId,
        },
        body: {
          source_id: stepId,
          position: 0,
        },
      });

      expect(stepRepositionResponse.status).toBe(204);
    } finally {
      if (stepId !== undefined) {
        const trashStepResponse = await client.recordings.trash({
          params: {
            bucketId,
            recordingId: stepId,
          },
        });
        expect([200, 204]).toContain(trashStepResponse.status);
      }

      if (cardId !== undefined) {
        const trashCardResponse = await client.recordings.trash({
          params: {
            bucketId,
            recordingId: cardId,
          },
        });
        expect([200, 204]).toContain(trashCardResponse.status);
      }

      const trashColumnResponse = await client.recordings.trash({
        params: {
          bucketId,
          recordingId: columnId,
        },
      });
      expect([200, 204]).toContain(trashColumnResponse.status);
    }
  }, 30000);
});

async function resolveCardTableId(client: Client, bucket: number): Promise<number> {
  const response = await client.projects.get({
    params: {
      projectId: bucket,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load project for card table discovery (${response.status}).`);
  }

  const project = ProjectSchema.parse(response.body);
  const dock = Array.isArray(project.dock) ? project.dock : [];
  const entry = dock.find((item) => item.name === 'kanban_board' && item.enabled !== false);

  if (!entry) {
    throw new Error('Project does not expose a card table in the dock.');
  }

  return entry.id;
}
