import { NextRequest, NextResponse } from 'next/server';
import { upstreamWithRefresh } from '@/lib/api/server';

async function forward(req: NextRequest, params: { path: string[] }) {
  const subpath = '/' + params.path.join('/');
  const search = req.nextUrl.search;
  const upstreamPath = subpath + search;

  const headers: Record<string, string> = {};
  const ct = req.headers.get('Content-Type');
  if (ct) headers['Content-Type'] = ct;

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  const res = await upstreamWithRefresh(upstreamPath, {
    method: req.method,
    headers,
    body,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, await ctx.params);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, await ctx.params);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, await ctx.params);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, await ctx.params);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, await ctx.params);
}
