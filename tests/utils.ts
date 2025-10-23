import { buildClient } from '../lib/basecamp/buildClient';
import { getBearerToken } from '../lib/basecamp/getBearerToken';

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (value == null || value === '') {
    throw new Error(`Environment variable ${key} is required but missing.`);
  }
  return value;
}

export async function buildConfiguredClient() {
  const bearerToken = await getBearerToken({
    clientId: requireEnv('BASECAMP_CLIENT_ID'),
    clientSecret: requireEnv('BASECAMP_CLIENT_SECRET'),
    refreshToken: requireEnv('BASECAMP_REFRESH_TOKEN'),
    userAgent: requireEnv('BASECAMP_USER_AGENT'),
  });

  return buildClient({
    bearerToken,
    userAgent: requireEnv('BASECAMP_USER_AGENT'),
    accountId: requireEnv('BASECAMP_ACCOUNT_ID'),
  });
}
