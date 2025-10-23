import { z } from 'zod';
import { c } from './c';
import {
  campfiresRouter,
  clientApprovalsRouter,
  clientCorrespondencesRouter,
  clientRepliesRouter,
  clientVisibilityRouter,
  commentsRouter,
  forwardsRouter,
  inboxRepliesRouter,
  inboxesRouter,
  messageBoardsRouter,
  messageTypesRouter,
  messagesRouter,
} from './resources/communications';
import {
  attachmentsRouter,
  documentsRouter,
  uploadsRouter,
  vaultsRouter,
} from './resources/documents';
import { eventsRouter } from './resources/events';
import { lineupMarkersRouter } from './resources/lineup-markers';
import { peopleRouter } from './resources/people';
import { projectsRouter } from './resources/projects';
import { recordingsRouter } from './resources/recordings';
import {
  questionnairesRouter,
  questionsRouter,
  scheduleEntriesRouter,
  schedulesRouter,
} from './resources/scheduling';
import {
  todoListGroupsRouter,
  todoListsRouter,
  todoSetsRouter,
  todosRouter,
} from './resources/tasks';

export const contract = c.router(
  {
    projects: projectsRouter,
    people: peopleRouter,
    recordings: recordingsRouter,
    events: eventsRouter,
    lineupMarkers: lineupMarkersRouter,
    todoSets: todoSetsRouter,
    todoLists: todoListsRouter,
    todoListGroups: todoListGroupsRouter,
    todos: todosRouter,
    messageBoards: messageBoardsRouter,
    messageTypes: messageTypesRouter,
    messages: messagesRouter,
    comments: commentsRouter,
    campfires: campfiresRouter,
    inboxes: inboxesRouter,
    forwards: forwardsRouter,
    inboxReplies: inboxRepliesRouter,
    clientApprovals: clientApprovalsRouter,
    clientCorrespondences: clientCorrespondencesRouter,
    clientReplies: clientRepliesRouter,
    clientVisibility: clientVisibilityRouter,
    schedules: schedulesRouter,
    scheduleEntries: scheduleEntriesRouter,
    questionnaires: questionnairesRouter,
    questions: questionsRouter,
    documents: documentsRouter,
    vaults: vaultsRouter,
    uploads: uploadsRouter,
    attachments: attachmentsRouter,
  },
  {
    strictStatusCodes: true,
    baseHeaders: z.object({
      Authorization: z.string().min(1),
      'User-Agent': z.string().min(1).optional(),
      Accept: z.literal('application/json').optional(),
    }),
  },
);

export type Contract = typeof contract;
