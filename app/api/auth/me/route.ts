import { NextResponse } from 'next/server';
import { upstreamWithRefresh } from '@/lib/api/server';

export async function GET() {
  const res = await upstreamWithRefresh('/users/me', { method: 'GET' });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  });
}
