import { tsRestFetchApi, type ApiFetcherArgs } from '@ts-rest/core';

const MAX_RETRIES = 20;
const BASE_DELAY_MS = 500;
const JITTER_MS = 250;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseRetryAfterHeader = (headers: {
  get(name: string): string | null;
}): number | undefined => {
  const retryAfter = headers.get('Retry-After');
  if (!retryAfter) {
    return undefined;
  }

  const asSeconds = Number(retryAfter);
  if (!Number.isNaN(asSeconds)) {
    return Math.max(0, asSeconds * 1000);
  }

  const parsedDate = Date.parse(retryAfter);
  if (!Number.isNaN(parsedDate)) {
    return Math.max(0, parsedDate - Date.now());
  }

  return undefined;
};

const computeBackoffDelay = (attempt: number, retryAfterMs?: number) => {
  const linearDelay = BASE_DELAY_MS * attempt;
  const jitter = Math.random() * JITTER_MS;
  const computed = linearDelay + jitter;

  if (retryAfterMs === undefined) {
    return computed;
  }

  return Math.max(computed, retryAfterMs);
};

export async function fetcher(args: ApiFetcherArgs) {
  const url = new URL(args.path);
  const isRaw = (args.route as any).metadata?.rawResponse === true;

  if (!isRaw && !url.pathname.endsWith('.json')) {
    url.pathname = `${url.pathname}.json`;
  }

  const headers = { ...args.headers };
  if (isRaw) {
    delete headers.accept;
    delete headers.Accept;
  }

  const pathWithSuffix = url.toString();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    let response;

    if (isRaw) {
      const result = await fetch(pathWithSuffix, {
        method: args.method,
        headers,
      });
      response = {
        status: result.status,
        body: await result.arrayBuffer(),
        headers: result.headers,
      };
    } else {
      response = await tsRestFetchApi({
        ...args,
        path: pathWithSuffix,
        headers,
      });
    }

    if (response.status !== 429) {
      return response;
    }

    if (attempt === MAX_RETRIES) {
      return response;
    }

    const retryAfterMs = parseRetryAfterHeader(response.headers);
    const delay = computeBackoffDelay(attempt + 1, retryAfterMs);

    if (delay > 0) {
      await sleep(delay);
    }
  }

  // Exhausting the loop should already return; throw defensively to satisfy TypeScript.
  throw new Error('Exceeded retry attempts for Basecamp API request.');
}
