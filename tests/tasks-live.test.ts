import { beforeAll, describe, expect, it } from 'vitest';

import { Client } from 'src/buildClient';
import { ProjectSchema } from '../src/contract/schemas/projects';
import {
  TodoCollectionResponseSchema,
  TodoListGroupsResponseSchema,
  TodoListSchema,
  TodoListsResponseSchema,
  TodoSchema,
  TodoSetSchema,
  TodoTopLevelListSchema,
} from '../src/contract/schemas/tasks';
import { buildConfiguredClient, requireEnv } from './utils';

let client: Client;
let bucketId: number;
let todoSetId: number;

beforeAll(async () => {
  bucketId = Number(requireEnv('BASECAMP_BUCKET_ID'));
  client = await buildConfiguredClient();
  todoSetId = await resolveTodoSetId(client, bucketId);
});

describe('Basecamp todos (live)', () => {
  it('manages a to-do list and to-do lifecycle', async () => {
    const todoSetResponse = await client.todoSets.get({
      params: {
        bucketId,
        todosetId: todoSetId,
      },
    });

    expect(todoSetResponse.status).toBe(200);
    TodoSetSchema.parse(todoSetResponse.body);

    const listResponse = await client.todoLists.list({
      params: {
        bucketId,
        todosetId: todoSetId,
      },
      query: {},
    });

    expect(listResponse.status).toBe(200);
    TodoListsResponseSchema.parse(listResponse.body);

    const listNameBase = `Contract to-do list ${Date.now()}`;
    const createListResponse = await client.todoLists.create({
      params: {
        bucketId,
        todosetId: todoSetId,
      },
      body: {
        name: listNameBase,
        description: '<div>Automated list for contract smoke test.</div>',
      },
    });

    expect(createListResponse.status).toBe(201);
    const createdList = TodoTopLevelListSchema.parse(createListResponse.body);
    const todolistId = createdList.id;

    let groupId: number | undefined;
    let todoId: number | undefined;

    try {
      const getListResponse = await client.todoLists.get({
        params: {
          bucketId,
          todolistId,
        },
      });

      expect(getListResponse.status).toBe(200);
      TodoListSchema.parse(getListResponse.body);

      const listGroupsResponse = await client.todoListGroups.list({
        params: {
          bucketId,
          todolistId,
        },
        query: {},
      });

      expect(listGroupsResponse.status).toBe(200);
      TodoListGroupsResponseSchema.parse(listGroupsResponse.body);

      const groupCreateResponse = await client.todoListGroups.create({
        params: {
          bucketId,
          todolistId,
        },
        body: {
          name: `${listNameBase} – Group`,
        },
      });

      expect(groupCreateResponse.status).toBe(201);
      const createdGroup = TodoListSchema.parse(groupCreateResponse.body);
      groupId = createdGroup.id;

      const groupRepositionResponse = await client.todoListGroups.reposition({
        params: {
          bucketId,
          groupId,
        },
        body: {
          position: 1,
        },
      });

      expect(groupRepositionResponse.status).toBe(204);

      const todosListResponse = await client.todos.list({
        params: {
          bucketId,
          todolistId,
        },
        query: {},
      });

      expect(todosListResponse.status).toBe(200);
      TodoCollectionResponseSchema.parse(todosListResponse.body);

      const todoContentBase = `Contract to-do ${Date.now()}`;
      const todoCreateResponse = await client.todos.create({
        params: {
          bucketId,
          todolistId,
        },
        body: {
          content: todoContentBase,
          description: '<div>Automated to-do for contract smoke test.</div>',
        },
      });

      expect(todoCreateResponse.status).toBe(201);
      const createdTodo = TodoSchema.parse(todoCreateResponse.body);
      todoId = createdTodo.id;

      const todoUpdateResponse = await client.todos.update({
        params: {
          bucketId,
          todoId,
        },
        body: {
          content: `${todoContentBase} (updated)`,
          description: '<div>Automated to-do for contract smoke test.</div>',
        },
      });

      expect(todoUpdateResponse.status).toBe(200);
      const updatedTodo = TodoSchema.parse(todoUpdateResponse.body);
      expect(updatedTodo.content).toContain('(updated)');

      const todoGetResponse = await client.todos.get({
        params: {
          bucketId,
          todoId,
        },
      });

      expect(todoGetResponse.status).toBe(200);
      TodoSchema.parse(todoGetResponse.body);

      const completeResponse = await client.todos.complete({
        params: {
          bucketId,
          todoId,
        },
      });

      expect(completeResponse.status).toBe(204);

      const completedTodoResponse = await client.todos.get({
        params: {
          bucketId,
          todoId,
        },
      });

      expect(completedTodoResponse.status).toBe(200);
      const completedTodo = TodoSchema.parse(completedTodoResponse.body);
      expect(completedTodo.completed).toBe(true);

      const completedListResponse = await client.todos.list({
        params: {
          bucketId,
          todolistId,
        },
        query: {
          completed: true,
        },
      });

      expect(completedListResponse.status).toBe(200);
      const completedTodos = TodoCollectionResponseSchema.parse(completedListResponse.body);
      expect(completedTodos.some((item) => item.id === todoId)).toBe(true);

      const uncompleteResponse = await client.todos.uncomplete({
        params: {
          bucketId,
          todoId,
        },
      });

      expect(uncompleteResponse.status).toBe(204);

      const repositionResponse = await client.todos.reposition({
        params: {
          bucketId,
          todoId,
        },
        body: {
          position: 1,
        },
      });

      expect(repositionResponse.status).toBe(204);
    } finally {
      if (todoId !== undefined) {
        const trashTodoResponse = await client.todos.trash({
          params: {
            bucketId,
            todoId,
          },
        });
        expect(trashTodoResponse.status).toBe(204);
      }

      if (groupId !== undefined) {
        const trashGroupResponse = await client.todoLists.trash({
          params: {
            bucketId,
            todolistId: groupId,
          },
        });
        expect(trashGroupResponse.status).toBe(204);
      }

      const trashListResponse = await client.todoLists.trash({
        params: {
          bucketId,
          todolistId,
        },
      });
      expect(trashListResponse.status).toBe(204);
    }
  }, 20000);
});

async function resolveTodoSetId(client: Client, bucket: number): Promise<number> {
  const response = await client.projects.get({
    params: {
      projectId: bucket,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load project for todo set discovery (${response.status}).`);
  }

  const project = ProjectSchema.parse(response.body);
  const dock = Array.isArray(project.dock) ? project.dock : [];
  const todoSet = dock.find((entry) => entry.name === 'todoset' && entry.enabled !== false);

  if (!todoSet) {
    throw new Error('Project does not expose a to-do set in the dock.');
  }

  return todoSet.id;
}
