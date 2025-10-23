type RouteExecutor = (args: any) => Promise<{
  status: number;
  headers: Headers;
  body: unknown;
}>;

type MaybePromise<T> = T | Promise<T>;

type RouteResponse<TRoute extends RouteExecutor> = Awaited<ReturnType<TRoute>>;

type SuccessResponse<TRoute extends RouteExecutor, TStatus extends number> = Extract<
  RouteResponse<TRoute>,
  { status: TStatus }
> extends never
  ? never
  : Extract<RouteResponse<TRoute>, { status: TStatus }>;

type DefaultItem<TRoute extends RouteExecutor, TStatus extends number> = SuccessResponse<
  TRoute,
  TStatus
> extends { body: readonly (infer Element)[] }
  ? Element
  : SuccessResponse<TRoute, TStatus> extends { body: infer Body }
    ? Body
    : never;

export type AsyncPagedIteratorOptions<
  TRoute extends RouteExecutor,
  TStatus extends number,
  TItem,
> = {
  fetchPage: TRoute;
  request: Parameters<TRoute>[0];
  successStatus?: TStatus;
  extractItems?: (response: SuccessResponse<TRoute, TStatus>) => MaybePromise<readonly TItem[]>;
  maxPages?: number;
};

const NEXT_REL = 'next';

const parseNextPageNumber = (headers: Headers): number | undefined => {
  const raw = headers.get('link');
  if (!raw) {
    return undefined;
  }

  const segments = raw
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (const segment of segments) {
    const relMatch = segment.match(/rel\s*=\s*"([^"]+)"/i);
    if (!relMatch) {
      continue;
    }

    const rels = relMatch[1]
      .split(/\s+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

    if (!rels.includes(NEXT_REL)) {
      continue;
    }

    const uriMatch = segment.match(/<([^>]+)>/);
    if (!uriMatch) {
      continue;
    }

    try {
      const url = new URL(uriMatch[1]);
      const pageParam = url.searchParams.get('page');
      if (!pageParam) {
        return undefined;
      }

      const pageNumber = Number(pageParam);
      if (Number.isNaN(pageNumber)) {
        throw new Error(`Cannot parse "page" value "${pageParam}" from Link header.`);
      }

      return pageNumber;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse Link header URL: ${error.message}`);
      }
      throw error;
    }
  }

  return undefined;
};

const getPageFromRequest = (request: unknown): number | undefined => {
  if (!request || typeof request !== 'object') {
    return undefined;
  }

  const query = (request as { query?: unknown }).query;
  if (!query || typeof query !== 'object') {
    return undefined;
  }

  const page = (query as { page?: unknown }).page;
  if (typeof page === 'number') {
    return page;
  }

  if (typeof page === 'string') {
    const parsed = Number(page);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const withPage = <Req>(request: Req, page: number): Req => {
  const baseRequest = (request ?? {}) as Record<string, unknown>;
  const existingQuery =
    typeof baseRequest.query === 'object' && baseRequest.query !== null
      ? (baseRequest.query as Record<string, unknown>)
      : {};

  return {
    ...baseRequest,
    query: {
      ...existingQuery,
      page,
    },
  } as Req;
};

/**
 * Iterate through a paginated Basecamp endpoint by following the Link header emitted by the API.
 *
 * @example
 * for await (const project of asyncPagedIterator({
 *   fetchPage: client.projects.list,
 *   request: { query: {} },
 * })) {
 *   console.log(project.name);
 * }
 */
export async function* asyncPagedIterator<
  TRoute extends RouteExecutor,
  TStatus extends number = 200,
  TItem = DefaultItem<TRoute, TStatus>,
>(
  options: AsyncPagedIteratorOptions<TRoute, TStatus, TItem>,
): AsyncGenerator<TItem, void, unknown> {
  const successStatus = options.successStatus ?? (200 as TStatus);

  if ((options.request as unknown) == null) {
    throw new Error(
      'Paginated requests must include an argument object when invoking asyncPagedIterator.',
    );
  }

  let currentRequest = options.request;
  let processedPages = 0;
  const visitedPages = new Set<number>();

  const initialPage = getPageFromRequest(currentRequest) ?? 1;
  visitedPages.add(initialPage);

  const extractItems: (
    response: SuccessResponse<TRoute, TStatus>,
  ) => MaybePromise<readonly TItem[]> =
    options.extractItems ??
    ((response: SuccessResponse<TRoute, TStatus>) => {
      const body = response.body as unknown;
      if (!Array.isArray(body)) {
        throw new Error(
          'Paginated response body is not an array. Provide an extractItems option to control iteration output.',
        );
      }

      return body as readonly TItem[];
    });

  while (true) {
    processedPages += 1;
    const response = await options.fetchPage(currentRequest);

    if (response.status !== successStatus) {
      throw new Error(
        `Unexpected status code ${response.status} while paging results (expected ${successStatus}).`,
      );
    }

    const success = response as SuccessResponse<TRoute, TStatus>;
    const items = await Promise.resolve(extractItems(success));

    for (const item of items) {
      yield item;
    }

    if (options.maxPages && processedPages >= options.maxPages) {
      break;
    }

    const nextPage = parseNextPageNumber(success.headers);
    if (nextPage === undefined) {
      break;
    }

    if (visitedPages.has(nextPage)) {
      throw new Error(
        `Detected pagination loop while iterating paginated endpoint (page ${nextPage} repeated).`,
      );
    }

    visitedPages.add(nextPage);
    currentRequest = withPage(currentRequest, nextPage);
  }
}
