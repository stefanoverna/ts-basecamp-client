# Basecamp ts-rest Contract – Implementation Specs

## Objective
- Produce a complete `ts-rest` contract that mirrors the public Basecamp API (as documented under `docs/basecamp-api-specs`). The contract must be shareable between server and client packages and ready for OpenAPI generation.
- Follow `ts-rest` best practices so the contract remains maintainable, composable, and capable of powering runtime validation, documentation, and code generation.

## Inputs & References
- Basecamp API reference (`docs/basecamp-api-specs/README.md` plus every section under `docs/basecamp-api-specs/sections`).
- ts-rest documentation (`docs/ts-rest`) with emphasis on the Contract and Client guides.
- Existing product requirements (authentication with OAuth2 bearer token, required `User-Agent`, JSON-only endpoints, pagination headers, rate limiting guidance).

## Deliverables
- Source-of-truth contract exported from `contracts/basecamp/index.ts`.
- Domain routers and shared schema modules organised under `contracts/basecamp/**`.
- Shared client helpers under `lib/basecamp/**` (OAuth + contract-aware fetcher) to keep CLI tools and tests consistent.
- Reusable response/error schemas, metadata helpers, and common utilities (IDs, dates, pagination, rich text).
- Documentation comments (JSDoc) where they improve IntelliSense for complex fields.
- Verified type-check (`tsc`) and generated OpenAPI document illustrating completeness.
- Live smoke tests (Vitest) that exercise representative resource flows against the Basecamp API, plus supporting CLI scripts for manual validation.

## Non-Goals
- Implementing actual server/client handlers (only the contract and its typings).
- Business logic, storage, or OAuth flows.
- Automated syncing of docs → contract (manual translation from specs is required).

---

## ts-rest Best Practices To Adopt

### Contract Composition
- Use `initContract()` once and compose routers with `c.router({ ... })`. Prefer nested routers to mirror API domains.
- Enable `strictStatusCodes` globally to keep runtime and types in sync; configure clients with `throwOnUnknownStatus`.
- Provide `summary`, `description`, and stable `metadata` (e.g. `{ tag: 'Projects', operationId: 'projects.list' }`) for each route. Use metadata for tags, rate-limit categories, or permission hints—never store secrets.
- Group routes with `mergeRouters` when cross-domain reuse is needed (e.g. shared CRUD patterns).
- Apply `pathPrefix` on nested routers to reflect shared segments such as `/projects` or `/buckets/:bucketId`.

### Schema & Typing Strategy
- Standardise on **Zod** (`@ts-rest/core` + `zod`) for runtime validation and OpenAPI transformation.
- Store schemas under `contracts/basecamp/schemas`. Expose both Zod schemas and TypeScript types via `export type Project = z.infer<typeof ProjectSchema>`.
- Use helpers like `z.string().uuid()` or `z.string().datetime({ offset: true })` for IDs and timestamps.
- Model discriminated unions for polymorphic fields (e.g. `RecordingRef`, `BucketRef`).
- For rich text HTML, use `z.string().min(0)` together with JSDoc clarifying that the value is HTML.
- Reuse schemas for shared fragments (e.g. person summary) to keep responses consistent.
- Prefer “enum + passthrough” unions for documented enums, e.g. `z.enum(['active', 'archived']).or(z.string())`, giving autocomplete for known values without rejecting future ones Basecamp may introduce.

### Requests & Responses
- Define `pathParams`, `query`, `headers`, `body`, and `responses` explicitly. Favour `z.object` schemas; fall back to `c.type<{ ... }>()` only when structural typing is sufficient.
- Use `c.noBody()` for empty request or response payloads (e.g. `DELETE` returning 204).
- Use `contentType` with `multipart/form-data` for uploads and `application/x-www-form-urlencoded` when required by the API.
- For alternative response media types (CSV exports, file downloads), wrap with `c.otherResponse({ contentType, body })`.
- Observed error payloads for `400`, `404`, and `422` follow `{ status: number; error: string }`. Model this as the baseline schema and extend with optional fields when the docs document richer responses.
- `401 Unauthorized` currently returns an empty (HTML) body even when `Accept: application/json`. Clients must tolerate empty bodies and rely on status codes/headers.
- Treat `PUT` as the canonical verb for resource updates—`PATCH` requests against `projects/:id` currently respond with `400 Bad Request`.
- Capture rate limit headers (`Retry-After`, `X-RateLimit-*`) and pagination headers (`Link`, `X-Total-Count`) via route metadata so they can be surfaced in clients even though ts-rest does not type response headers directly.
- Define `commonResponses` on the root router for `401`, `403`, `404`, `409`, `422`, `429`, and `5xx` families. Basecamp docs do not prescribe a single error payload shape—specify a conservative union (e.g. `{ error: string; type?: string; details?: unknown }`) and validate against live responses if possible.
- Live traffic: `403` responses can be empty `text/html` (e.g. toggling client visibility on inherited recordings) or JSON with `{ message, admission_url, admission_method }` when project admission is required. `429` returns `text/plain` with guidance (“API rate limit exceeded…”) plus a `Retry-After` header in seconds. A `409` payload is still unobserved—keep the schema permissive until we can capture one.

### Query Parameters
- Default to simple query strings (`z.string()`, `z.coerce.number()`).
- Opt in to `jsonQuery` when a route accepts complex objects. Ensure client/server implementations also enable JSON query handling.
- Provide sane defaults and `.optional()` flags mirroring the API docs.

### Documentation & Tooling
- Add JSDoc to complex schemas for better DX.
- Keep each route’s metadata aligned with eventual OpenAPI tags/categories. Use metadata to store `docsPath` pointing to the source markdown anchor for traceability.
- After contract completion, call `generateOpenApi` with custom schema transformers (Zod 3 sync or custom).

---

## Current Implementation Snapshot

The repository already bootstraps the project with a working slice of the contract plus supporting tooling. Treat this as the canonical pattern for the remaining resources.

### Code structure in place

```
contracts/basecamp/
├── config.ts              # initContract + strict status defaults
├── index.ts               # root router export
├── fetcher.ts             # custom client fetcher that appends .json
├── resources/
│   └── messages.ts        # list/get/create/update/pin/unpin/trash routes
└── schemas/
    ├── common.ts          # BasecampId, person summaries, auth headers, etc.
    └── messages.ts        # message payloads and request bodies

lib/basecamp/
├── auth.ts                # dotenv loader + OAuth token helpers
└── client.ts              # createBasecampClient(): ready-to-use ts-rest client

scripts/messages-client.ts # CLI wrapper around the shared client
tests/
├── setup.ts               # loads env once for Vitest
└── messages-live.test.ts  # end-to-end smoke test for the messages router
```

Key conventions demonstrated by the existing code:

- **Paths** omit the `.json` suffix; the shared `basecampApiFetcher` appends it after ts-rest expands params.
- **Headers** are typed using lower-case keys (`authorization`, `user-agent`) to align with ts-rest’s inferred shapes.
- **Metadata** provides `summary`, `description`, and `docsPath` linking back to the source markdown.
- **Strict status codes** are enforced at each router to keep schema and runtime in lockstep.
- **Live verification** is performed via Vitest, creating and trashing a message to leave the account clean.

### Recommended repository layout going forward

As we add new routers, keep the structure below (mirroring documentation domains):

```
contracts/basecamp/
├── config.ts
├── index.ts
├── fetcher.ts
├── schemas/
│   ├── common.ts
│   ├── primitives.ts
│   ├── people.ts
│   ├── recordings.ts
│   ├── communications/...
│   └── (additional domain schema files)
└── resources/
    ├── core/           # projects, people, basecamps, recordings, lineup markers
    ├── communications/ # messages, message boards, comments, client comms
    ├── tasks/          # todos, lists, groups, card tables
    ├── documents/      # documents, uploads, vaults, attachments
    ├── scheduling/     # schedules, entries, questionnaires, questions
    ├── automation/     # templates, webhooks, chatbots
    └── reports/        # events, timesheets, subscriptions
```

Each router module should export its router plus useful type aliases (e.g. `export type MessagesRouter = typeof messagesRouter`). Shared schemas live beside the routers to keep imports manageable; prefer smaller files (per domain) over one massive schema module.

---

## Resource Implementation Cycle

1. Review the source markdown in `docs/basecamp-api-specs/sections` and capture every documented route, parameter, and response nuance.
2. Model or extend the accompanying Zod schemas under `contracts/basecamp/schemas/**`, keeping reusable fragments in the shared modules.
3. Implement the domain router under `contracts/basecamp/resources/**`, wiring metadata (`summary`, `description`, `docsPath`) and aligning with shared error responses. Apply the recordings abstraction approach: use entity-specific parameter names for entity-specific operations, retain `recordingId` only for genuinely generic cross-cutting operations.
4. Add or update a live smoke test in `tests/*-live.test.ts` that exercises the key resource flow (list, create, mutate, archive/trash as applicable). The test must assert both HTTP status codes and validate each response body via the relevant Zod schema (e.g. `ProjectSchema.parse(response.body)`) to guarantee the contract stays in sync with the real API.
5. Run `npm run contract:check` and `npm test` before considering the resource complete; update supporting CLI scripts when manual validation helps.

Model resources from the outside in. If a resource depends on another domain (e.g. a todo lives inside a todolist group), finish the parent contract first, then add the child. Update smoke tests to create any throwaway parent resources so dependent flows can run end-to-end without manual setup.

---

## Testing & Verification

### Type safety

- `npm run contract:check` — runs `tsc --noEmit`. Keep the tree warning-free before opening a PR.

### Live smoke tests

`tests/messages-live.test.ts` exercises the full message lifecycle:

1. Load the project dock (`GET /projects/:id.json`) to discover the message board ID.
2. Create a message with status `active`.
3. Pin and unpin the message.
4. Update subject/content fields.
5. Trash the message via `PUT /buckets/:bucketId/recordings/:recordingId/status/trashed`.

Each live test should parse the API responses with the canonical Zod schemas to confirm the contract matches production payloads.

Environment variables (supplied via `.env`) required for both tests and scripts:

```
BASECAMP_CLIENT_ID=
BASECAMP_CLIENT_SECRET=
BASECAMP_REFRESH_TOKEN=
BASECAMP_USER_AGENT=
BASECAMP_BUCKET_ID=        # numeric project/bucket serving as the smoke-test sandbox
BASECAMP_ACCOUNT_ID=       # optional override; resolved automatically if omitted
```

The shared `.env` checked into this workspace points `BASECAMP_BUCKET_ID` at a dedicated throwaway project configured for smoke testing. It is safe to create, mutate, and trash resources inside that bucket—tests must keep their activity scoped there so production data stays untouched. Creating additional temporary projects is fine too; just name them `Test project ${uniqueId}` so they are easy to identify and clean up automatically.

Run the suite with:

```
npm test
```

> These tests hit the live API. Use a dedicated project/bucket intended for automated validation. The suite cleans up after itself by trashing the created message.

---

## Cross-Cutting Modelling Guidelines

- **Base URL & Account ID**: Keep the account ID out of route definitions. Consumers should instantiate clients with `baseUrl: https://3.basecampapi.com/${accountId}`. Contract paths start with `/projects.json`, `/buckets/:bucketId/...`, etc.
- **Authentication Headers**: Require `Authorization` and `User-Agent` headers on every route via a shared header schema imported into each router (or enforce in the client wrapper). Consider additional optional headers from specs (`If-Unmodified-Since`, `If-Match`) where documented.
- **Pagination**: All collection endpoints use geared pagination. Model `query` with `page?: z.coerce.number()` and any documented filters (e.g. `status`). Capture `Link` and `X-Total-Count` expectations in metadata (`{ pagination: { mode: 'link-header', headers: ['Link', 'X-Total-Count'] } }`).
- **Rate Limiting**: Add metadata for rate-limit category (`read` vs `write`) so consumers can implement buckets. Observed `429` responses include a `Retry-After` header (seconds) and a `text/plain` body instructing the client to retry after the window—capture both in metadata/common responses.
- **Timestamps**: Basecamp emits ISO8601 strings with timezone offsets. Standardise on `const IsoDate = z.string().datetime({ offset: true })`.
- **Caching / Concurrency**: `GET` and `HEAD` endpoints return ETag headers (often weak `W/` values) while `Last-Modified` is frequently `null`. Live tests show `If-Match` and `If-Unmodified-Since` are ignored on `PUT` updates (both to-dos and documents), so treat these headers as optional hints captured in metadata rather than enforced preconditions.
- **IDs & SGIDs**: Numeric IDs appear as integers, but to preserve compatibility use `z.number().int()` in schemas and provide `z.coerce.number()` for input query/path params. Where Basecamp uses SGIDs (signed global IDs), capture as plain strings (or `z.string().regex(/^BAh7/...)` if validation is worthwhile).
- **Rich Text**: Content fields often contain HTML with embedded `<bc-attachment>` tags. Represent them as `RichTextHtmlSchema` (string) and document usage so clients treat them as HTML.
- **Attachments & Uploads**: `POST /attachments.json` expects the raw file bytes plus a mandatory `name` query parameter, with caller-provided `Content-Type` (and optional `Content-Length`) headers; it returns `{ attachable_sgid: string }`. Subsequent upload endpoints (`/uploads.json`, `/documents.json`, etc.) accept JSON bodies referencing that SGID (`attachable_sgid`, optional `description`, optional `base_name`). Reusing a consumed SGID currently yields a `404 { status, error }` response—model that via shared error schemas. When files are sent directly, require `multipart/form-data` and allow `FormData` via `z.instanceof(FormData)`.
- **Trash vs Destroy**: Many delete operations soft-delete (“trash”). Capture behaviour in metadata and route summary (status codes often 204 or 202).
- **Linking Entities**: Many payloads include `bucket`, `parent`, `creator`, `subscription_url`, etc. Model these as nested schemas to enable reuse across modules.
- **Recordings Abstraction**: Basecamp's API uses a "recordings" concept as a generic abstraction for various content types (messages, todos, documents, etc.). However, this implementation detail should be hidden from the client API surface for better developer experience:
  - **Entity-specific operations** (create, update, delete, pin, etc.) should use entity-specific parameter names (`messageId`, `todoId`, `commentId`) even when the underlying API path uses `/recordings/:recordingId/...`
  - **Generic cross-cutting operations** (like commenting) should retain `recordingId` since they genuinely work across multiple entity types
  - **Example**: `client.messages.trash({ messageId })` maps to `PUT /buckets/:bucketId/recordings/:messageId/status/trashed` but `client.comments.create({ recordingId })` reflects the genuine generic nature of commenting
  - **Rationale**: Developers should work with the domain concepts they understand (messages, todos) rather than internal implementation abstractions (recordings)

---

### Phase 0 – Tooling Setup
1. Install dependencies: `@ts-rest/core`, `@ts-rest/open-api`, `zod`, and dev typings.
2. Configure TypeScript path aliases (`@basecamp-contract/schemas` etc.) for ergonomics.
3. Add linting/formatting rules if not present (e.g. ensure consistent casing for literal unions).

### Phase 1 – Foundation
1. Expand `contracts/basecamp/config.ts` with any shared `commonResponses` once error schemas land.
2. Grow the shared schema library:
   - `schemas/common.ts` already exposes `BasecampId`, `PersonSummary`, `AuthHeadersSchema`.
   - Add `schemas/primitives.ts`, `schemas/people.ts`, `schemas/recordings.ts`, etc., as new domains are tackled.
3. Keep `contracts/basecamp/fetcher.ts` as the single place that appends `.json`. Reuse for all clients (tests, CLI, future services).
4. Centralise OAuth and client bootstrapping in `lib/basecamp/auth.ts` / `lib/basecamp/client.ts`. Extend these helpers as new authentication nuances appear (e.g. webhooks, bots).
5. Introduce shared error schemas (`BasecampErrorSchema`, `ValidationErrorSchema`) and wire them into `commonResponses` on the root contract.

### Phase 2 – Domain Routers
Translate every Markdown section into a router module. For each route:
- Pull HTTP method, path, documented parameters, and response structure.
- Build Zod schemas for request payloads and responses, reusing shared schemas.
- Add `metadata.docsPath` referencing the markdown anchor (e.g. `sections/projects.md#get-projects`).
- Add `summary` and descriptive `description`.
- Identify query parameters (`status`, `page`, filters) and encode them.
- Contract paths should omit the `.json` suffix documented in the API (the shared fetcher reattaches it before sending requests).

Below is the full coverage checklist, grouped by domain (file paths reference `docs/basecamp-api-specs/sections/*`):

#### Core Entities
- **basecamps.md**
  - `GET /basecamps.json` – list account basecamps.
  - `GET /basecamps/:id.json` – single basecamp.
- **projects.md**
  - `GET /projects.json` (`status` filter, pagination).
  - `GET /projects/:id.json`.
  - `POST /projects.json`.
  - `PUT /projects/:id.json`.
  - `DELETE /projects/:id.json` (trash).
- **people.md**
  - `GET /people.json` (pagination, search filters).
  - `GET /people/:id.json`.
  - `GET /projects/:project_id/people.json`.
  - `GET /people/me.json`.
- **recordings.md**
  - `GET /recordings/:id.json`.
  - `GET /recordings/:id/comments.json` etc. (cross references—ensure schema reuse).
- **events.md**
  - `GET /events.json` with `since`, `cursor`, `bucket` filters. Use `metadata.pagination` to mark incremental feed.
- **lineup_markers.md**
  - `POST /lineups/markers.json`.
  - `PUT /lineups/markers/:id.json`.
  - `DELETE /lineups/markers/:id.json`.

#### Communications
- **message_boards.md**
  - `GET /buckets/:bucket_id/message_boards/:id.json`.
  - `GET /projects/:id/message_boards.json`.
- **message_types.md**
  - `GET /message_types.json` (static enumerations).
- **messages.md**
  - `GET /buckets/:bucket_id/message_boards/:message_board_id/messages.json`.
  - `GET /buckets/:bucket_id/messages/:id.json`.
  - `POST /buckets/:bucket_id/message_boards/:message_board_id/messages.json`.
  - `PUT /buckets/:bucket_id/messages/:id.json`.
  - `POST /buckets/:bucket_id/recordings/:id/pin.json`.
  - `DELETE /buckets/:bucket_id/recordings/:id/pin.json`.
  - `PUT /buckets/:bucket_id/recordings/:id/status/trashed.json`.
- **comments.md**
  - `GET /buckets/:bucket_id/recordings/:recording_id/comments.json`.
  - `GET /buckets/:bucket_id/comments/:id.json`.
  - `POST /buckets/:bucket_id/recordings/:recording_id/comments.json`.
  - `PUT /buckets/:bucket_id/comments/:id.json`.
  - `DELETE /buckets/:bucket_id/comments/:id.json`.
- **inboxes.md**, **inbox_replies.md**, **forwards.md**
  - Cover listing inboxes, posting replies (`POST /buckets/:bucket_id/inboxes/:id/replies.json`), fetching forwards.
- **client_approvals.md**, **client_correspondences.md**, **client_replies.md**, **client_visibility.md**
  - Ensure each interaction with client-visible artefacts is represented; include boolean toggles (`POST /client/visibility.json`), retrieval endpoints, and update actions.

#### Task Management
- **todosets.md**
  - `GET /buckets/:bucket_id/todosets/:id.json`.
  - `POST /buckets/:bucket_id/todosets.json`.
- **todolist_groups.md**, **todolists.md**, **todos.md**
  - CRUD for groups, lists, and todos, including reorder endpoints (`POST /reorder.json` patterns), completion toggles, and trash endpoints.
- **card_tables.md**, **card_table_columns.md**, **card_table_cards.md**, **card_table_steps.md**
  - Card table board management: list, create, update, move, on-hold, colour changes, watchers. Pay attention to endpoints requiring request bodies like `{ position: number }`.

#### Scheduling & Check-ins
- **schedules.md**
  - `GET /buckets/:bucket_id/schedules/:id.json`.
  - `POST /buckets/:bucket_id/schedules.json`.
- **schedule_entries.md**
  - CRUD plus trash for individual entries.
- **questionnaires.md**, **questions.md**, **question_answers.md**
  - Cover retrieving questionnaires, posting questions, submitting answers. Model answer payloads (rich text, attachments).
- **timesheets.md**
  - Report endpoints by time frame (project, recording). Model filters (date ranges).

#### Documents & Files
- **documents.md**
  - CRUD for documents; note rich text fields.
- **attachments.md** & **uploads.md**
  - `POST /attachments.json` (multipart) returning upload metadata.
  - `POST /uploads.json` (multipart) plus retrieval.
  - `DELETE /uploads/:id.json` (trash).
- **vaults.md**
  - Folder-level management (list, create, update).

#### Real-Time & Automation
- **campfires.md**
  - Fetch chat transcripts, post messages, star/unstar.
- **chatbots.md**
  - Register / update webhooks for Campfire bots; ensure header requirements captured (`X-Basecamp-Signature`? Confirm from docs).
- **templates.md**
  - Manage templates and project constructions.
- **subscriptions.md**
  - Subscription toggles (`GET/POST/DELETE /subscription.json`).
- **webhooks.md**
  - CRUD for webhooks; expect secret tokens and `payload_url`.

#### Supporting Material
- **rich_text.md**
  - No direct routes, but defines HTML conventions. Document in metadata (e.g. `metadata.richText = true`) for relevant endpoints so consumers handle HTML.

> **Checklist Tip**: tick off each section once its router exports all endpoints with associated schemas and typed responses.

### Phase 3 – Root Composition
1. Combine domain routers in `resources/**` into `contracts/basecamp/index.ts`:
   ```ts
   import { c } from './config';
   import { projectsRouter } from './resources/core/projects';
   // ...

   export const basecampContract = c.router({
     projects: projectsRouter,
     people: peopleRouter,
     // ...
   });
   ```
2. Apply a top-level `pathPrefix: ''` (paths already include leading slash).
3. Export helper types (`export type BasecampContract = typeof basecampContract;`).
4. Provide example client/server usage within comments or separate docs.

### Phase 4 – Validation & Tooling Integration
1. Generate OpenAPI via `generateOpenApi(basecampContract, ...)`. Add CI step that diffs output.
2. Run `tsc --noEmit` to guarantee integrity.
3. Consider snapshot tests for contract drift (e.g. serialise contract definition and assert structure).
4. Optionally expose domain-specific clients by calling `initClient` in a thin wrapper for consumer convenience.

---

## Quality Gates & Acceptance Criteria
- Every documented endpoint represented once (no duplicates, no omissions).
- All routes include `summary`, `description`, metadata with `docsPath`, and strict status codes.
- Shared schemas deduplicated; no inlined duplicates for identical payloads.
- Multipart and non-JSON responses correctly described with `contentType`/`c.otherResponse`.
- OpenAPI generation succeeds without falling back to `any` schemas.
- Clients can infer `ClientInferRequest`/`ClientInferResponseBody` without `any`.
- Pagination metadata documented for each collection route.

---

## Remaining Questions / Follow-ups
- Capture a `409 Conflict` response—attempts across to-do updates, uploads, webhooks, and subscription flows have yet to surface one, so keep conflict schemas liberal until we observe a payload.
- Multipart upload flow confirmed: raw `POST /attachments.json?name=` produces an `attachable_sgid`, and `POST /buckets/:bucket_id/vaults/:vault_id/uploads.json` accepts JSON with `attachable_sgid`, optional HTML `description`, and `base_name`. Document that reuse of an SGID returns `404`.
- `If-Match` / `If-Unmodified-Since` headers appear to be ignored on updates (tested against todolists and documents); treat them as optional metadata rather than enforceable preconditions.
- Investigate persistent `500` HTML responses from `GET /buckets/:bucket_id/todolists.json` (observed for project `44502442` without extra query params)—determine whether the endpoint is deprecated or requires additional filters.

Once these questions are resolved—and every section in `docs/basecamp-api-specs/sections` is checked off—the Basecamp ts-rest contract will be production-ready.
