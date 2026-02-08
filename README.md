# basecamp-client

Basecamp API client and contract built with [`ts-rest`](https://ts-rest.com/) and [Zod](https://zod.dev/). The package exposes a fully typed contract, a ready-to-use client builder, and OAuth helpers so teams can share a single source of truth across services, CLIs, and tests.

## Installation

```bash
npm install basecamp-client
# or
yarn add basecamp-client
```

Both CommonJS (`require`) and ESM (`import`) entry points are included, along with full TypeScript declarations.

## Quick start

```ts
import { buildClient, getBearerToken } from 'basecamp-client';

const bearerToken = await getBearerToken({
  clientId: process.env.BASECAMP_CLIENT_ID!,
  clientSecret: process.env.BASECAMP_CLIENT_SECRET!,
  refreshToken: process.env.BASECAMP_REFRESH_TOKEN!,
});

const client = buildClient({
  bearerToken,
  accountId: process.env.BASECAMP_ACCOUNT_ID!,
});

const { body: projects } = await client.projects.list({ query: {} });
console.log(projects);
```

## Usage

### Create a client

```ts
import { buildClient } from 'basecamp-client';

const client = buildClient({
  bearerToken: process.env.BASECAMP_ACCESS_TOKEN!,
  accountId: process.env.BASECAMP_ACCOUNT_ID!,
  userAgent: process.env.BASECAMP_USER_AGENT!, // optional but recommended by Basecamp
});

const { status, body } = await client.projects.list({ query: {} });
```

`buildClient` creates a ts-rest client that targets `https://3.basecampapi.com/{accountId}`. It sets `Authorization`, `Accept`, and `Content-Type` headers automatically and appends `.json` to every request path.

### Refresh OAuth tokens

Basecamp access tokens expire. Use `getBearerToken` to exchange a refresh token for a fresh access token via the 37signals OAuth endpoint:

```ts
import { getBearerToken } from 'basecamp-client';

const bearerToken = await getBearerToken({
  clientId: process.env.BASECAMP_CLIENT_ID!,
  clientSecret: process.env.BASECAMP_CLIENT_SECRET!,
  refreshToken: process.env.BASECAMP_REFRESH_TOKEN!,
  userAgent: process.env.BASECAMP_USER_AGENT!,
});
```

### Iterate through paginated endpoints

Basecamp collection endpoints return paginated results using `Link` headers. `asyncPagedIterator` follows those headers automatically:

```ts
import { asyncPagedIterator } from 'basecamp-client';

for await (const project of asyncPagedIterator({
  fetchPage: client.projects.list,
  request: { query: {} },
})) {
  console.log(project.name);
}
```

To collect all pages into a single array:

```ts
import { asyncPagedToArray } from 'basecamp-client';

const allProjects = await asyncPagedToArray({
  fetchPage: client.projects.list,
  request: { query: {} },
});
```

Options:

| Option | Description |
| --- | --- |
| `fetchPage` | The client method to call (e.g. `client.projects.list`). |
| `request` | Arguments forwarded to `fetchPage`. |
| `successStatus` | Expected HTTP status (default `200`). |
| `extractItems` | Custom function to pull items from the response (defaults to using `body` as an array). |
| `maxPages` | Stop after this many pages. |

## Supported resources

The client covers the following Basecamp 3 API resources. Each resource is accessed as a property on the client object (e.g. `client.projects`, `client.todos`).

### Projects and core

| Client property | Operations |
| --- | --- |
| `projects` | list, get, create, update, trash |
| `people` | list, listForProject, listPingable, get, me, updateProjectAccess |
| `recordings` | list, trash, archive, activate |
| `events` | listForRecording |
| `lineupMarkers` | create, update, destroy |

### Messages and communication

| Client property | Operations |
| --- | --- |
| `messageBoards` | get, listForProject |
| `messages` | list, get, create, update, pin, unpin, trash |
| `messageTypes` | list, get, create, update, destroy |
| `comments` | list, get, create, update, trash |
| `campfires` | list, get, listLines, getLine, createLine, deleteLine |
| `inboxes` | get |
| `forwards` | list, get, trash |
| `inboxReplies` | list, get |
| `clientCorrespondences` | list, get |
| `clientApprovals` | list, get |
| `clientReplies` | list, get |
| `clientVisibility` | update |

### To-dos

| Client property | Operations |
| --- | --- |
| `todoSets` | get |
| `todoLists` | list, get, create, update, trash |
| `todoListGroups` | list, create, reposition |
| `todos` | list, get, create, update, complete, uncomplete, reposition, trash |

### Card tables (Kanban)

| Client property | Operations |
| --- | --- |
| `cardTables` | get |
| `cardTableColumns` | get, create, update, move, watch, unwatch, enableOnHold, disableOnHold, updateColor |
| `cardTableCards` | list, get, create, update, move |
| `cardTableSteps` | create, update, setCompletion, reposition |

### Scheduling

| Client property | Operations |
| --- | --- |
| `schedules` | get, update |
| `scheduleEntries` | list, get, getOccurrence, create, update, trash |
| `questionnaires` | get |
| `questions` | list, get |

### Documents and files

| Client property | Operations |
| --- | --- |
| `vaults` | list, get, create, update, trash |
| `documents` | list, get, create, update, trash |
| `uploads` | list, get, create, update, trash |
| `attachments` | create |

## Conventions

### Path parameters

Most resource-scoped endpoints require a `bucketId` parameter (the Basecamp project ID) along with a resource-specific ID. All IDs are non-negative integers, coerced from path parameters via Zod.

```ts
// Fetch a single to-do
const { body: todo } = await client.todos.get({
  params: { bucketId: 12345, todoId: 67890 },
});
```

### Recording-based status changes

Basecamp models many resources (messages, to-dos, documents, etc.) as "recordings". Trashing, archiving, and re-activating use a shared endpoint pattern through the `recordings` resource:

```ts
// Trash any recording
await client.recordings.trash({
  params: { bucketId: 12345, recordingId: 67890 },
});
```

Individual resources also expose convenience `trash` operations that map to the same underlying endpoint.

### Querying and filtering

Collection endpoints accept query parameters for filtering and sorting:

```ts
const { body: todos } = await client.todos.list({
  params: { bucketId: 12345, todolistId: 67890 },
  query: { status: 'active', completed: 'true' },
});
```

Common query parameters across resources:

| Parameter | Values |
| --- | --- |
| `status` | `active`, `archived`, `trashed` |
| `sort` | `created_at`, `updated_at` |
| `direction` | `asc`, `desc` |
| `page` | Page number (1-indexed) |

### Rate-limit handling

The built-in fetcher automatically retries on HTTP 429 responses (up to 20 attempts). It uses linear backoff with jitter and respects the `Retry-After` header when present. No configuration is needed.

### Error handling

The client is configured with `throwOnUnknownStatus: true`, meaning any response with a status code not declared in the contract will throw. Expected error statuses (404, 507, etc.) are part of the contract and returned as typed discriminated unions:

```ts
const response = await client.projects.get({
  params: { projectId: 999 },
});

if (response.status === 404) {
  console.log('Project not found');
} else {
  console.log(response.body.name);
}
```

## The contract

Under the hood, every endpoint in this package is defined as a [ts-rest contract](https://ts-rest.com/). A contract is a declarative description of an API: its routes, path parameters, query parameters, request bodies, and response shapes -- all expressed with Zod schemas. The client you get from `buildClient` is generated directly from this contract, which is what makes every call fully type-safe with no code generation step.

Because the contract is a plain data structure (not tied to any HTTP library), it can be reused in ways that go beyond making API calls:

- **Custom fetchers** -- pass the contract to `initClient` from `@ts-rest/core` with your own fetch wrapper (e.g. to add logging, custom auth, or use a different HTTP library).
- **OpenAPI generation** -- the package already ships an `openapi.json` built from the contract. You can regenerate it or use the contract to produce docs, mock servers, or SDK stubs for other languages.
- **Server-side validation** -- if you build a Basecamp proxy or middleware, the same Zod schemas that type-check the client can validate incoming requests on the server.
- **Shared types** -- import the contract's inferred types into any TypeScript project so that producers and consumers of Basecamp data agree on the same shapes at compile time.

### Use the contract directly

```ts
import { contract } from 'basecamp-client';
import { initClient } from '@ts-rest/core';

const client = initClient(contract, { /* custom fetcher config */ });
```

### Type exports

The package exports the `Client` and `Contract` types, as well as Zod-inferred types for every schema:

```ts
import type { Client, Contract } from 'basecamp-client';
```

## Development

```bash
npm install
```

### Scripts

- `npm run build` -- bundle the package with tsup (CJS + ESM + types).
- `npm run contract:check` -- type-check the contract with `tsc --noEmit`.
- `npm test` -- execute the Vitest live smoke suite *(requires Basecamp credentials and hits the real API)*.
- `npm run format` / `npm run lint` / `npm run check` -- Biome formatting and linting utilities.

### Environment variables

Live tests and manual scripts expect the following variables (see `tests/utils.ts`):

```
BASECAMP_CLIENT_ID
BASECAMP_CLIENT_SECRET
BASECAMP_REFRESH_TOKEN
BASECAMP_USER_AGENT
BASECAMP_ACCOUNT_ID
BASECAMP_BUCKET_ID
```

Populate them via `.env` (ignored from git) or your shell environment before running tests.

### Running live tests

The Vitest suite provisions, updates, and trashes real Basecamp resources in a dedicated sandbox project. To execute the tests:

```bash
npm test
```

> These tests are not mocked. Ensure your credentials target an account that is safe for automated writes.

## Publishing

`prepublishOnly` runs `npm run build`, producing artifacts in `dist/` via tsup. After verifying the bundle and contract typings, publish as usual:

```bash
npm publish
```

## License

MIT
