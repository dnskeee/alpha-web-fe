import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasAuth = req.cookies.get('at')?.value;

  const isAuthPage = PUBLIC_PATHS.includes(pathname);

  if (!hasAuth && !isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  if (hasAuth && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/|api/|favicon.ico|icon.png|apple-icon.png|images/).*)',
  ],
};
