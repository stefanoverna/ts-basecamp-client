type GetBearerTokenOptions = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userAgent: string;
};

export async function getBearerToken({
  clientId,
  clientSecret,
  refreshToken,
  userAgent,
}: GetBearerTokenOptions): Promise<string> {
  const response = await fetch('https://launchpad.37signals.com/authorization/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
    },
    body: JSON.stringify({
      type: 'refresh',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to obtain access token (${response.status}): ${errorBody}`);
  }

  const payload: { access_token: string } = await response.json();
  return payload.access_token;
}
