import { NextResponse } from 'next/server';
import { upstreamNoAuth } from '@/lib/api/server';

export async function POST(req: Request) {
  const body = await req.text();
  const res = await upstreamNoAuth('/auth/password/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  });
}
