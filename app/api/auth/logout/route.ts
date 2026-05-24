import { NextResponse } from 'next/server';
import { upstreamNoAuth } from '@/lib/api/server';
import { readAccessToken, readRefreshToken, clearAuthCookies } from '@/lib/auth/cookies';

export async function POST() {
  const rt = await readRefreshToken();
  const at = await readAccessToken();
  if (rt && at) {
    // Inject AT manually because upstreamNoAuth skips token injection — logout still needs to revoke server-side.
    await upstreamNoAuth('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${at}` },
      body: JSON.stringify({ refreshToken: rt }),
    }).catch(() => {});
  }
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
