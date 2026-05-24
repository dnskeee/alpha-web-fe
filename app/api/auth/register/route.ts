import { NextResponse } from 'next/server';
import { upstreamWithRefresh } from '@/lib/api/server';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(req: Request) {
  const body = await req.json();
  const res = await upstreamWithRefresh('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  }
  const data = JSON.parse(text);
  const { accessToken, refreshToken, ...user } = data;
  await setAuthCookies(accessToken, refreshToken);
  return NextResponse.json(user);
}
