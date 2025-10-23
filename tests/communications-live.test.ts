import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { Client } from 'lib/basecamp/buildClient';
import {
  CampfireLineListResponseSchema,
  CampfireLineSchema,
  CampfireListResponseSchema,
  CampfireSchema,
  ClientApprovalListResponseSchema,
  ClientApprovalSchema,
  ClientCorrespondenceListResponseSchema,
  ClientCorrespondenceSchema,
  ClientReplyListResponseSchema,
  ClientReplySchema,
  ClientVisibilityRecordingSchema,
  CommentSchema,
  CommentsResponseSchema,
  ForwardListResponseSchema,
  ForwardSchema,
  InboxReplyListResponseSchema,
  InboxReplySchema,
  InboxSchema,
  MessageBoardSchema,
  MessageListResponseSchema,
  MessageSchema,
  MessageTypeSchema,
  MessageTypesResponseSchema,
} from '../contracts/basecamp/schemas/communications';
import { ProjectSchema } from '../contracts/basecamp/schemas/projects';
import { buildConfiguredClient, requireEnv } from './utils';

let client: Client;
let bucketId: number;
let messageBoardId: number;
let campfireId: number | undefined;
let inboxId: number | undefined;
let clientsEnabled = false;
let messageTypeId: number | undefined;
let messageSubject: string | undefined;
let messageId: number | undefined;
let commentId: number | undefined;

beforeAll(async () => {
  bucketId = Number(requireEnv('BASECAMP_BUCKET_ID'));

  client = await buildConfiguredClient();

  const projectResources = await resolveProjectResources(client, bucketId);

  messageBoardId = projectResources.messageBoardId;
  campfireId = projectResources.campfireId;
  inboxId = projectResources.inboxId;
  clientsEnabled = projectResources.clientsEnabled;
});

describe('Basecamp communications (live)', () => {
  it('lists message types for the project', async () => {
    const response = await client.messageTypes.list({
      params: {
        bucketId,
      },
    });

    expect(response.status).toBe(200);
    MessageTypesResponseSchema.parse(response.body);
  });

  it('creates a message type for testing', async () => {
    const createResponse = await client.messageTypes.create({
      params: {
        bucketId,
      },
      body: {
        name: `Test Type ${Date.now()}`,
        icon: '🧪',
      },
    });

    expect(createResponse.status).toBe(201);
    const created = MessageTypeSchema.parse(createResponse.body);
    messageTypeId = created.id;
  });

  it('retrieves the message board and lists messages', async () => {
    const messageBoardResponse = await client.messageBoards.get({
      params: {
        bucketId,
        messageBoardId,
      },
    });
    expect(messageBoardResponse.status).toBe(200);
    MessageBoardSchema.parse(messageBoardResponse.body);

    const messagesListResponse = await client.messages.list({
      params: {
        bucketId,
        messageBoardId,
      },
    });
    expect(messagesListResponse.status).toBe(200);
    MessageListResponseSchema.parse(messagesListResponse.body);
  });

  it('creates and updates a message', async () => {
    if (messageTypeId === undefined) {
      throw new Error('Message type must be created before creating messages.');
    }

    messageSubject = `Contract test message ${Date.now()}`;
    const messageCreateResponse = await client.messages.create({
      params: {
        bucketId,
        messageBoardId,
      },
      body: {
        subject: messageSubject,
        content: '<div>This is a test message created by the contract suite.</div>',
        status: 'active',
        category_id: messageTypeId,
      },
    });
    expect(messageCreateResponse.status).toBe(201);
    const createdMessage = MessageSchema.parse(messageCreateResponse.body);
    messageId = createdMessage.id;

    const messageGetResponse = await client.messages.get({
      params: {
        bucketId,
        messageId,
      },
    });
    expect(messageGetResponse.status).toBe(200);
    MessageSchema.parse(messageGetResponse.body);

    const messageUpdateResponse = await client.messages.update({
      params: {
        bucketId,
        messageId,
      },
      body: {
        subject: `${messageSubject} (updated)`,
        content: '<div>This is an updated test message.</div>',
        category_id: messageTypeId,
      },
    });
    expect(messageUpdateResponse.status).toBe(200);
    const updatedMessage = MessageSchema.parse(messageUpdateResponse.body);
    expect(updatedMessage.subject).toContain('(updated)');
  });

  it('pins and unpins the message', async () => {
    if (messageId === undefined) {
      throw new Error('Message must be created before pinning.');
    }

    const pinResponse = await client.messages.pin({
      params: {
        bucketId,
        messageId,
      },
    });
    expect(pinResponse.status).toBe(204);

    const unpinResponse = await client.messages.unpin({
      params: {
        bucketId,
        messageId,
      },
    });
    expect(unpinResponse.status).toBe(204);
  });

  it('manages comments on the message', async () => {
    if (messageId === undefined) {
      throw new Error('Message must be created before commenting.');
    }

    const commentsListResponse = await client.comments.list({
      params: {
        bucketId,
        recordingId: messageId,
      },
    });
    expect(commentsListResponse.status).toBe(200);
    CommentsResponseSchema.parse(commentsListResponse.body);

    const commentCreateResponse = await client.comments.create({
      params: {
        bucketId,
        recordingId: messageId,
      },
      body: {
        content: '<div>This is a test comment created by the contract suite.</div>',
      },
    });
    expect(commentCreateResponse.status).toBe(201);
    const createdComment = CommentSchema.parse(commentCreateResponse.body);
    commentId = createdComment.id;

    const commentGetResponse = await client.comments.get({
      params: {
        bucketId,
        commentId,
      },
    });
    expect(commentGetResponse.status).toBe(200);
    CommentSchema.parse(commentGetResponse.body);

    const commentUpdateResponse = await client.comments.update({
      params: {
        bucketId,
        commentId,
      },
      body: {
        content: '<div>This is an updated test comment.</div>',
      },
    });
    expect(commentUpdateResponse.status).toBe(200);
    const updatedComment = CommentSchema.parse(commentUpdateResponse.body);
    expect(updatedComment.content).toContain('updated test comment');
  });

  it('toggles client visibility on the message', async () => {
    if (messageId === undefined) {
      throw new Error('Message must be created before toggling visibility.');
    }

    const makeVisibleResponse = await client.clientVisibility.update({
      params: {
        bucketId,
        recordingId: messageId,
      },
      body: {
        visible_to_clients: true,
      },
    });
    expect(makeVisibleResponse.status).toBe(200);
    const visibleMessage = ClientVisibilityRecordingSchema.parse(makeVisibleResponse.body);
    expect(visibleMessage.visible_to_clients).toBe(true);

    const hideResponse = await client.clientVisibility.update({
      params: {
        bucketId,
        recordingId: messageId,
      },
      body: {
        visible_to_clients: false,
      },
    });
    expect(hideResponse.status).toBe(200);
    const hiddenMessage = ClientVisibilityRecordingSchema.parse(hideResponse.body);
    expect(hiddenMessage.visible_to_clients).toBe(false);
  });

  it('updates and fetches the message type', async () => {
    if (messageTypeId === undefined) {
      throw new Error('Message type must be created before updating.');
    }

    const updateResponse = await client.messageTypes.update({
      params: {
        bucketId,
        categoryId: messageTypeId,
      },
      body: {
        name: `Updated Test Type ${Date.now()}`,
        icon: '🔬',
      },
    });
    expect(updateResponse.status).toBe(200);
    const updatedType = MessageTypeSchema.parse(updateResponse.body);
    expect(updatedType.name).toContain('Updated');

    const getResponse = await client.messageTypes.get({
      params: {
        bucketId,
        categoryId: messageTypeId,
      },
    });
    expect(getResponse.status).toBe(200);
    MessageTypeSchema.parse(getResponse.body);
  });

  it('handles campfire line flows', async () => {
    const campfiresListResponse = await client.campfires.list({});
    expect(campfiresListResponse.status).toBe(200);
    const campfires = CampfireListResponseSchema.parse(campfiresListResponse.body);

    if (campfires.length === 0) {
      console.warn('Skipping Campfire checks: no Campfires available for this account.');
      return;
    }

    const campfireUnderTest =
      (campfireId !== undefined && campfires.find((campfire) => campfire.id === campfireId)) ??
      campfires.find((campfire) => campfire.bucket.id === bucketId);

    if (!campfireUnderTest) {
      console.warn(
        'Skipping Campfire checks: none of the available Campfires belong to the test project.',
      );
      return;
    }

    const targetCampfireId = campfireUnderTest.id;

    const campfireGetResponse = await client.campfires.get({
      params: {
        bucketId,
        campfireId: targetCampfireId,
      },
    });
    expect(campfireGetResponse.status).toBe(200);
    CampfireSchema.parse(campfireGetResponse.body);

    const campfireLinesResponse = await client.campfires.listLines({
      params: {
        bucketId,
        campfireId: targetCampfireId,
      },
    });
    expect(campfireLinesResponse.status).toBe(200);
    CampfireLineListResponseSchema.parse(campfireLinesResponse.body);

    let createdLineId: number | undefined;
    const lineContent = `Automated campfire line ${Date.now()}`;
    try {
      const campfireLineCreateResponse = await client.campfires.createLine({
        params: {
          bucketId,
          campfireId: targetCampfireId,
        },
        body: {
          content: lineContent,
        },
      });
      expect(campfireLineCreateResponse.status).toBe(201);
      const createdLine = CampfireLineSchema.parse(campfireLineCreateResponse.body);
      createdLineId = createdLine.id;
      expect(createdLine.content).toContain(lineContent);

      const campfireLineGetResponse = await client.campfires.getLine({
        params: {
          bucketId,
          campfireId: targetCampfireId,
          lineId: createdLine.id,
        },
      });
      expect(campfireLineGetResponse.status).toBe(200);
      CampfireLineSchema.parse(campfireLineGetResponse.body);
    } finally {
      if (createdLineId !== undefined) {
        const campfireLineDeleteResponse = await client.campfires.deleteLine({
          params: {
            bucketId,
            campfireId: targetCampfireId,
            lineId: createdLineId,
          },
        });
        expect(campfireLineDeleteResponse.status).toBe(204);
      }
    }
  });

  it('handles inbox forward flows', async () => {
    if (inboxId === undefined) {
      console.warn('Skipping inbox and forward checks: project does not expose an inbox.');
      return;
    }

    const inboxResponse = await client.inboxes.get({
      params: {
        bucketId,
        inboxId,
      },
    });
    expect(inboxResponse.status).toBe(200);
    InboxSchema.parse(inboxResponse.body);

    const forwardsListResponse = await client.forwards.list({
      params: {
        bucketId,
        inboxId,
      },
    });
    expect(forwardsListResponse.status).toBe(200);
    const forwards = ForwardListResponseSchema.parse(forwardsListResponse.body);

    if (forwards.length === 0) {
      console.warn('Skipping forward checks: inbox has no forwards.');
      return;
    }

    const forwardUnderTest = forwards[0];

    const forwardGetResponse = await client.forwards.get({
      params: {
        bucketId,
        forwardId: forwardUnderTest.id,
      },
    });
    expect(forwardGetResponse.status).toBe(200);
    ForwardSchema.parse(forwardGetResponse.body);

    const inboxRepliesResponse = await client.inboxReplies.list({
      params: {
        bucketId,
        forwardId: forwardUnderTest.id,
      },
    });
    expect(inboxRepliesResponse.status).toBe(200);
    const inboxReplies = InboxReplyListResponseSchema.parse(inboxRepliesResponse.body);

    if (inboxReplies.length > 0) {
      const inboxReplyGetResponse = await client.inboxReplies.get({
        params: {
          bucketId,
          forwardId: forwardUnderTest.id,
          replyId: inboxReplies[0].id,
        },
      });
      expect(inboxReplyGetResponse.status).toBe(200);
      InboxReplySchema.parse(inboxReplyGetResponse.body);
    }

    const forwardTrashResponse = await client.forwards.trash({
      params: {
        bucketId,
        forwardId: forwardUnderTest.id,
      },
    });
    expect(forwardTrashResponse.status).toBe(204);

    const forwardReactivateResponse = await client.recordings.activate({
      params: {
        bucketId,
        recordingId: forwardUnderTest.id,
      },
    });
    expect(forwardReactivateResponse.status).toBe(204);
  });

  it('handles client communications flows', async () => {
    if (!clientsEnabled) {
      console.warn('Skipping client communications checks: project has clients disabled.');
      return;
    }

    const clientApprovalsResponse = await client.clientApprovals.list({
      params: {
        bucketId,
      },
    });
    expect(clientApprovalsResponse.status).toBe(200);
    const clientApprovals = ClientApprovalListResponseSchema.parse(clientApprovalsResponse.body);
    expect(clientApprovals.length).toBeGreaterThan(0);
    const approvalId = clientApprovals[0].id;

    const clientApprovalGetResponse = await client.clientApprovals.get({
      params: {
        bucketId,
        approvalId,
      },
    });
    expect(clientApprovalGetResponse.status).toBe(200);
    const approval = ClientApprovalSchema.parse(clientApprovalGetResponse.body);
    if (Array.isArray(approval.responses)) {
      approval.responses.forEach((response) => {
        expect(response.id).toBeGreaterThan(0);
      });
    }

    const clientCorrespondencesResponse = await client.clientCorrespondences.list({
      params: {
        bucketId,
      },
    });
    expect(clientCorrespondencesResponse.status).toBe(200);
    const clientCorrespondences = ClientCorrespondenceListResponseSchema.parse(
      clientCorrespondencesResponse.body,
    );
    expect(clientCorrespondences.length).toBeGreaterThan(0);
    const correspondenceUnderTest = clientCorrespondences[0];

    const clientCorrespondenceGetResponse = await client.clientCorrespondences.get({
      params: {
        bucketId,
        correspondenceId: correspondenceUnderTest.id,
      },
    });
    expect(clientCorrespondenceGetResponse.status).toBe(200);
    const correspondence = ClientCorrespondenceSchema.parse(clientCorrespondenceGetResponse.body);

    const clientRepliesResponse = await client.clientReplies.list({
      params: {
        bucketId,
        recordingId: correspondence.id,
      },
    });
    expect(clientRepliesResponse.status).toBe(200);
    const clientReplies = ClientReplyListResponseSchema.parse(clientRepliesResponse.body);

    if (clientReplies.length > 0) {
      const clientReplyGetResponse = await client.clientReplies.get({
        params: {
          bucketId,
          recordingId: correspondence.id,
          replyId: clientReplies[0].id,
        },
      });
      expect(clientReplyGetResponse.status).toBe(200);
      ClientReplySchema.parse(clientReplyGetResponse.body);
    } else {
      expect(correspondence.replies_count).toBe(0);
    }
  });
});

afterAll(async () => {
  if (commentId !== undefined) {
    try {
      const trashCommentResponse = await client.comments.trash({
        params: {
          bucketId,
          commentId,
        },
      });
      expect(trashCommentResponse.status).toBe(204);
    } catch (error) {
      if (isRateLimitError(error)) {
        console.warn('Rate limited while trashing comment; skipping cleanup.');
      } else {
        throw error;
      }
    } finally {
      commentId = undefined;
    }
  }

  if (messageId !== undefined) {
    try {
      const trashMessageResponse = await client.messages.trash({
        params: {
          bucketId,
          messageId,
        },
      });
      expect(trashMessageResponse.status).toBe(204);
    } catch (error) {
      if (isRateLimitError(error)) {
        console.warn('Rate limited while trashing message; skipping cleanup.');
      } else {
        throw error;
      }
    } finally {
      messageId = undefined;
    }
  }

  if (messageTypeId !== undefined) {
    const messageTypeDeleteResponse = await client.messageTypes.destroy({
      params: {
        bucketId,
        categoryId: messageTypeId,
      },
    });
    expect(messageTypeDeleteResponse.status).toBe(204);
    messageTypeId = undefined;
  }
});

interface ProjectResources {
  messageBoardId: number;
  campfireId?: number;
  inboxId?: number;
  clientsEnabled: boolean;
}

async function resolveProjectResources(client: Client, bucket: number): Promise<ProjectResources> {
  const response = await client.projects.get({
    params: {
      projectId: bucket,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load project for dock discovery (${response.status}).`);
  }

  const project = ProjectSchema.parse(response.body);
  const dock = Array.isArray(project.dock) ? project.dock : [];
  const messageBoard = dock.find(
    (entry) => entry.name === 'message_board' && entry.enabled !== false,
  );
  const campfire = dock.find((entry) => entry.name === 'campfire' && entry.enabled !== false);
  const inbox = dock.find((entry) => entry.name === 'inbox' && entry.enabled !== false);

  if (!messageBoard) {
    throw new Error('Project does not expose a message board in the dock.');
  }

  return {
    messageBoardId: messageBoard.id,
    campfireId: campfire?.id,
    inboxId: inbox?.id,
    clientsEnabled: project.clients_enabled,
  };
}

function isRateLimitError(error: unknown): boolean {
  return error instanceof Error && /got:\s*429/.test(error.message);
}
