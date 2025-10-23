import { initClient as tsRestInitClient } from '@ts-rest/core';
import { basecampContract } from '../../contracts/basecamp';
import { basecampApiFetcher } from './fetcher';

type InitClientOptions = { bearerToken: string; accountId: string; userAgent: string };

export function buildClient(options: InitClientOptions) {
  return tsRestInitClient(basecampContract, {
    baseUrl: `https://3.basecampapi.com/${options.accountId}`,
    baseHeaders: {
      Authorization: `Bearer ${options.bearerToken}`,
      'User-Agent': options.userAgent,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    throwOnUnknownStatus: true,
    api: basecampApiFetcher,
  });
}

export type Client = Awaited<ReturnType<typeof buildClient>>;
