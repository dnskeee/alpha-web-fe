import { NextResponse } from 'next/server';
import { upstreamNoAuth } from '@/lib/api/server';
import { readRefreshToken, setAuthCookies, clearAuthCookies } from '@/lib/auth/cookies';

export async function POST() {
  const rt = await readRefreshToken();
  if (!rt) return NextResponse.json({ error: 'no refresh token' }, { status: 401 });
  const res = await upstreamNoAuth('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: rt }),
  });
  if (!res.ok) { await clearAuthCookies(); return NextResponse.json({ error: 'refresh failed' }, { status: 401 }); }
  const tokens = (await res.json()) as { accessToken?: string; refreshToken?: string };
  if (!tokens.accessToken || !tokens.refreshToken) {
    await clearAuthCookies();
    return NextResponse.json({ error: 'refresh failed' }, { status: 401 });
  }
  await setAuthCookies(tokens.accessToken, tokens.refreshToken);
  return NextResponse.json({ ok: true });
}
