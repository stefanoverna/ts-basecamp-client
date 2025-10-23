# basecamp-client

Basecamp API client and contract built with `ts-rest`. The package exposes a fully typed contract, a ready-to-use client builder, and OAuth helpers so teams can share a single source of truth across services, CLIs, and tests.

## Installation

```bash
npm install basecamp-client
# or
yarn add basecamp-client
```

## Usage

### Create a client

```ts
import { buildClient } from 'basecamp-client';

const client = buildClient({
  bearerToken: process.env.BASECAMP_ACCESS_TOKEN!,
  accountId: process.env.BASECAMP_ACCOUNT_ID!,
  userAgent: process.env.BASECAMP_USER_AGENT!,
});

const projects = await client.projects.list({ query: {} });
console.log(projects.body);
```

### Refresh OAuth tokens

```ts
import { getBearerToken } from 'basecamp-client';

const bearerToken = await getBearerToken({
  clientId: process.env.BASECAMP_CLIENT_ID!,
  clientSecret: process.env.BASECAMP_CLIENT_SECRET!,
  refreshToken: process.env.BASECAMP_REFRESH_TOKEN!,
  userAgent: process.env.BASECAMP_USER_AGENT!,
});

const client = buildClient({
  bearerToken: bearerToken,
  accountId: process.env.BASECAMP_ACCOUNT_ID!,
  userAgent: process.env.BASECAMP_USER_AGENT!,
});
```

### Contract access

```ts
import { contract } from 'basecamp-client';
import { initClient } from '@ts-rest/core';

const client = initClient(contract, { /* custom fetcher config */ });
```

## Development

```bash
npm install
```

### Scripts

- `npm run build` – bundle the package with tsup (CJS + ESM + types).
- `npm run contract:check` – type-check the contract with `tsc --noEmit`.
- `npm test` – execute the Vitest live smoke suite *(requires Basecamp credentials and hits the real API)*.
- `npm run format` / `npm run lint` / `npm run check` – Biome formatting and linting utilities.

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
