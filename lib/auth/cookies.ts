import 'server-only';
import { cookies } from 'next/headers';

const AT = 'at';
const RT = 'rt';
/** Non-httpOnly marker so client JS can tell whether a session probably exists without seeing the token. */
const SESSION = 's';

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const sessionMarkerOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(AT, accessToken, { ...baseOptions, maxAge: 60 * 60 });
  store.set(RT, refreshToken, { ...baseOptions, maxAge: 60 * 60 * 24 * 30 });
  store.set(SESSION, '1', { ...sessionMarkerOptions, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(AT);
  store.delete(RT);
  store.delete(SESSION);
}

export async function readAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AT)?.value ?? null;
}

export async function readRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(RT)?.value ?? null;
}
