import { readAccessToken, readRefreshToken, setAuthCookies, clearAuthCookies } from '@/lib/auth/cookies';

const UPSTREAM = process.env.ALPHA_API_URL ?? 'https://api.beprime.pro/api/v1';

export class UpstreamError extends Error {
  constructor(public status: number, public body: string) {
    super(`Upstream ${status}: ${body.slice(0, 200)}`);
  }
}

interface UpstreamInit extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  /** If true, do not attach Authorization. */
  noAuth?: boolean;
}

async function rawUpstream(path: string, init: UpstreamInit, token: string | null): Promise<Response> {
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(init.headers ?? {})) {
    headers[k.toLowerCase()] = v;
  }
  delete headers['host'];
  delete headers['connection'];
  delete headers['cookie'];
  if (!init.noAuth && token) headers['authorization'] = `Bearer ${token}`;
  return fetch(`${UPSTREAM}${path}`, { ...init, headers });
}

async function tryRefresh(): Promise<boolean> {
  const rt = await readRefreshToken();
  if (!rt) return false;
  const res = await fetch(`${UPSTREAM}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: rt }),
  });
  if (!res.ok) { await clearAuthCookies(); return false; }
  const tokens = (await res.json()) as { accessToken: string; refreshToken: string };
  await setAuthCookies(tokens.accessToken, tokens.refreshToken);
  return true;
}

export async function upstreamWithRefresh(path: string, init: UpstreamInit = {}): Promise<Response> {
  const token = await readAccessToken();
  let res = await rawUpstream(path, init, token);
  if (res.status !== 401 || init.noAuth) return res;
  const refreshed = await tryRefresh();
  if (!refreshed) return res;
  const newToken = await readAccessToken();
  res = await rawUpstream(path, init, newToken);
  return res;
}

export function upstreamNoAuth(path: string, init: Omit<UpstreamInit, 'noAuth'> = {}): Promise<Response> {
  return rawUpstream(path, { ...init, noAuth: true }, null);
}
