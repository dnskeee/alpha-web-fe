# alpha-web-fe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the React Native app `alpha-fe` into a Next.js web app `alpha-web-fe` (mobile viewport only for v1), preserving design, logic, and assets 1:1, with auth proxied via httpOnly cookies.

**Architecture:** Next.js 15 App Router; CSS Modules + token-driven CSS variables; React Context for state; Framer Motion for animation; Next route handlers proxy `/api/*` to `https://api.beprime.pro/api/v1` and manage auth cookies. UI lives in a centered max-width-430px column on desktop.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), CSS Modules, `motion` (Framer Motion), `next/font/google` (Manrope), npm.

**Source spec:** `docs/superpowers/specs/2026-05-24-alpha-web-fe-design.md`. Read it before starting.

**Source app to port from:** `/Users/dinar.faiskhanov/Projects/alpha/alpha-fe/`.

---

## Working notes for the engineer

### No tests in v1

This plan does **not** follow TDD. The user chose "None for now" for tests during brainstorming. Verification is by:
- `npx tsc --noEmit` (must pass after every task)
- `npm run lint` (must pass after every task)
- `npm run dev` and visual check in a mobile-viewport browser window

If you find yourself wanting to add a test for a tricky piece, add it; don't build a framework around it.

### Standard RN → Web swaps (used in nearly every component port)

Apply these mechanically; spec §8.2 and §8.7 are the source of truth:

| RN source | Web replacement |
|---|---|
| `import { View, Text, StyleSheet, Pressable, ScrollView, FlatList } from 'react-native'` | JSX tags + `Foo.module.css`. View=`<div>`, Text=`<span>`/`<p>`, Pressable/TouchableOpacity=`<button type="button">`, ScrollView=`<div>` with `overflow: auto`, FlatList=`.map()` |
| `import { Stack, useLocalSearchParams, useRouter, Link } from 'expo-router'` | `import { useRouter, useParams, useSearchParams } from 'next/navigation'`; `import Link from 'next/link'` |
| `import { useSafeAreaInsets } from 'react-native-safe-area-context'` | CSS `env(safe-area-inset-*)`; drop the hook |
| `import { LinearGradient } from 'expo-linear-gradient'` | CSS `background: linear-gradient(...)` |
| `import { Image } from 'expo-image'` | `import Image from 'next/image'` (or plain `<div>` with CSS background for sprites) |
| `import * as Haptics from 'expo-haptics'` | Drop calls (no-op) |
| `import Animated, { useSharedValue, useAnimatedStyle, withTiming, ... } from 'react-native-reanimated'` | `import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'` |
| `import { StatusBar } from 'expo-status-bar'` | Drop; theme-color meta tag covers iOS Safari chrome |
| `useColorScheme()` from `react-native` | `useTheme()` from our `contexts/ThemeContext` |
| `Platform.OS === 'web'` branches | Keep only the web branch, drop the rest |
| `Pressable` `onPress` | `<button>` `onClick` |
| `style={[a, b, condition && c]}` | `className={clsx(s.a, s.b, condition && s.c)}` (install `clsx`) |

### Per-call gotchas for ported screens

- Every `withAuth(t => api.foo.bar(x, t))` becomes `withAuth(() => api.foo.bar(x))` (token arg gone everywhere — see spec §7.6).
- `useLocalSearchParams<{ id: string }>()` from expo-router → `useParams<{ id: string }>()` from `next/navigation`.
- `router.push('/lesson/' + id)` works the same in `next/navigation`'s `useRouter()`.
- `<Stack.Screen options={...} />` lines have no equivalent; delete them (page metadata is done via Next `metadata` exports).

### File path conventions

- Source paths refer to `/Users/dinar.faiskhanov/Projects/alpha/alpha-fe/...`.
- Destination paths refer to `/Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/...`.
- Inside the destination repo, prefer the alias `@/` (configured in tsconfig) — e.g. `@/components/icons/BackIcon`.

### Commit and tooling rules

- After every task, run `npx tsc --noEmit && npm run lint` and confirm both pass before committing.
- Commit messages: short, imperative, no body unless non-obvious. Add the trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- Use `git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe ...` (per project `CLAUDE.md`).
- Never `cd <path> && git ...`.

---

## File structure (created across all tasks)

```
alpha-web-fe/
├─ app/
│  ├─ layout.tsx, loading.tsx, globals.css
│  ├─ icon.png, apple-icon.png
│  ├─ (auth)/{login,register,forgot-password,reset-password,verify-email}/page.tsx
│  ├─ (tabs)/{layout.tsx,page.tsx,modules/page.tsx,profile/page.tsx}
│  ├─ course/[id]/page.tsx
│  ├─ module/[id]/{page.tsx,_components/*}
│  ├─ lesson/[id]/page.tsx
│  ├─ {roadmap,settings,streak,select-speaker,select-timezone,modal}/page.tsx
│  └─ api/
│     ├─ auth/{login,register,guest,logout,refresh,me,forgot-password,reset-password,verify-email}/route.ts
│     └─ [...path]/route.ts
├─ components/
│  ├─ frame/AppFrame.tsx + .module.css
│  ├─ icons/* (23 SVGs)
│  ├─ ui/* (9 files)
│  ├─ bp/* (20 files)
│  ├─ lesson/{LessonCard,LessonHeader,LessonStreak,ModuleSkills,cardReadiness.ts,icons/LessonGlyphs.tsx}
│  ├─ lesson/steps/* (15)
│  ├─ lesson/tests/* (7)
│  ├─ {parallax-scroll-view,hello-wave,themed-text,themed-view,haptic-tab,external-link}.tsx
├─ contexts/{AuthContext,SpeakerContext,ThemeContext}.tsx
├─ lib/
│  ├─ api/{index.ts,server.ts,streakCache.ts,timezone.ts}
│  ├─ auth/cookies.ts
│  └─ utils/plural.ts
├─ constants/{palette,theme,shadows,speakers,timezones}.ts
├─ types/{api,lesson}.ts
├─ public/images/* (copied verbatim)
├─ middleware.ts
├─ next.config.ts, tsconfig.json, package.json, README.md, .env.example
```

---

## Task 1: Scaffold Next.js app and strip the demo

**Files:**
- Create / overwrite: every file under `alpha-web-fe/` except the existing `.git/` and `README.md`.

- [ ] **Step 1: Scaffold the app in a temporary directory**

```bash
cd /tmp
rm -rf alpha-web-fe-scaffold
npx --yes create-next-app@latest alpha-web-fe-scaffold \
  --typescript --eslint --app --src-dir=false \
  --tailwind=false --turbopack=false --import-alias "@/*" \
  --use-npm --skip-install
```

- [ ] **Step 2: Move scaffold contents into the existing repo (preserving .git and README)**

```bash
cd /tmp/alpha-web-fe-scaffold
rsync -a --exclude='.git' --exclude='README.md' ./ /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/
```

- [ ] **Step 3: Install dependencies**

```bash
cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe
npm install
npm install motion clsx
```

- [ ] **Step 4: Strip demo content**

Replace `app/page.tsx` with a placeholder:

```tsx
export default function Home() {
  return <main>alpha-web-fe</main>;
}
```

Empty out `app/globals.css` to the bare minimum (we'll fill it in Task 4):

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
```

Delete: `app/favicon.ico`, `public/*.svg` (next/vercel/file/window/globe), `app/page.module.css`.

- [ ] **Step 5: Verify it boots**

```bash
cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all three pass.

- [ ] **Step 6: Commit**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add -A
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
chore: scaffold Next.js app

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Configure tooling (TS strict, paths, env)

**Files:**
- Modify: `tsconfig.json`
- Create: `.env.example`, `.env.local` (uncommitted), `next.config.ts`

- [ ] **Step 1: Make `tsconfig.json` strict and set the `@/` alias**

Ensure the `compilerOptions` block contains:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] },
    "noUncheckedIndexedAccess": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Create `.env.example`**

```
ALPHA_API_URL=https://api.beprime.pro/api/v1
```

- [ ] **Step 3: Create `.env.local` (uncommitted) with the same value**

```bash
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/.env.example \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/.env.local
```

Confirm `.env.local` is gitignored (the create-next-app `.gitignore` already excludes `.env*.local`).

- [ ] **Step 4: Set viewport meta in `next.config.ts`**

Leave `next.config.ts` as the scaffolded default for now (no special config needed).

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add -A
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
chore: strict tsconfig and env example

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Port design tokens (constants/)

**Files:**
- Create: `constants/palette.ts`, `constants/theme.ts`, `constants/shadows.ts`, `constants/speakers.ts`, `constants/timezones.ts`

- [ ] **Step 1: Copy each constants file verbatim from alpha-fe**

```bash
mkdir -p /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/constants
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/constants/palette.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/constants/theme.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/constants/shadows.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/constants/speakers.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/constants/timezones.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/constants/
```

- [ ] **Step 2: Resolve RN-specific imports in the copied files**

Open each constants file and check for `react-native` imports. The most likely offender is shadow definitions using `Platform`. If found, drop the Platform branch (always use the web shape — `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` become a single `boxShadow` string).

If `shadows.ts` exposes RN style objects, convert each entry to expose **both** the RN shape (for any TS consumer that may still expect it) and a `css: string` property whose value is a CSS `box-shadow`. Example:

```ts
export const shadows = {
  card: {
    css: '0 4px 12px rgba(0,0,0,0.08)',
  },
  // ...
};
```

If your `shadows.ts` is just numbers/object shapes, leave it. We'll consume the values from the next task's CSS variable generator.

- [ ] **Step 3: Verify types**

```bash
npx tsc --noEmit
```

Expected: passes (no consumers yet).

- [ ] **Step 4: Commit**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add constants/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(tokens): port palette, theme, shadows, speakers, timezones

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Global CSS, theme variables, fonts, ThemeContext, AppFrame, RootLayout, loading

**Files:**
- Create: `app/globals.css`, `contexts/ThemeContext.tsx`, `components/frame/AppFrame.tsx`, `components/frame/AppFrame.module.css`, `app/layout.tsx`, `app/loading.tsx`
- Modify: `app/page.tsx` (placeholder remains)

- [ ] **Step 1: Write `app/globals.css` with CSS variables driven by tokens**

Open `alpha-fe/constants/palette.ts` and `alpha-fe/constants/theme.ts` to see the exact color names exposed by `theme.light` and `theme.dark`. For every color key in `theme.light`, emit a `--color-<key>` variable; same for `theme.dark`.

Use this template (fill the variable values from the actual TS source — names are illustrative):

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; }
body {
  font-family: var(--font-manrope), system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: var(--bg-surround);
  color: var(--color-text);
}

:root[data-theme="light"] {
  --color-bg: #ffffff;
  --color-text: #11181C;
  --color-text-muted: #687076;
  --color-primary: #...;     /* fill from theme.light */
  /* ...one --color-* per key... */
  --bg-surround: #f2f3f5;
  --shadow-card: 0 4px 12px rgba(0,0,0,0.08);
}

:root[data-theme="dark"] {
  --color-bg: #11181C;
  --color-text: #ECEDEE;
  --color-text-muted: #9BA1A6;
  --color-primary: #...;     /* fill from theme.dark */
  /* ... */
  --bg-surround: #0a0d0f;
  --shadow-card: 0 4px 12px rgba(0,0,0,0.4);
}

button { font: inherit; color: inherit; background: none; border: none; padding: 0; cursor: pointer; }
a { color: inherit; text-decoration: none; }
input, textarea { font: inherit; color: inherit; }
```

- [ ] **Step 2: Create `contexts/ThemeContext.tsx`**

```tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemePref = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  pref: ThemePref;
  resolved: ResolvedTheme;
  setPref: (p: ThemePref) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolve(pref: ThemePref): ResolvedTheme {
  if (pref === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>('system');
  const [resolved, setResolved] = useState<ResolvedTheme>('light');

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as ThemePref | null) ?? 'system';
    setPrefState(stored);
    const r = resolve(stored);
    setResolved(r);
    document.documentElement.setAttribute('data-theme', r);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      r === 'dark' ? '#11181C' : '#ffffff',
    );
  }, []);

  useEffect(() => {
    if (pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const r = mq.matches ? 'dark' : 'light';
      setResolved(r);
      document.documentElement.setAttribute('data-theme', r);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  function setPref(next: ThemePref) {
    localStorage.setItem('theme', next);
    setPrefState(next);
    const r = resolve(next);
    setResolved(r);
    document.documentElement.setAttribute('data-theme', r);
  }

  return (
    <ThemeContext.Provider value={{ pref, resolved, setPref }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

- [ ] **Step 3: Create `components/frame/AppFrame.tsx` and `AppFrame.module.css`**

`AppFrame.module.css`:

```css
.frame {
  max-width: 430px;
  min-height: 100dvh;
  margin: 0 auto;
  background: var(--color-bg);
  color: var(--color-text);
  position: relative;
  overflow-x: hidden;
}
```

`AppFrame.tsx`:

```tsx
import s from './AppFrame.module.css';

export function AppFrame({ children }: { children: React.ReactNode }) {
  return <div className={s.frame}>{children}</div>;
}
```

- [ ] **Step 4: Write `app/layout.tsx` (RootLayout)**

```tsx
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { AppFrame } from '@/components/frame/AppFrame';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'alpha',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

const noFoucScript = `
(function() {
  try {
    var p = localStorage.getItem('theme') || 'system';
    var d = p === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : p;
    document.documentElement.setAttribute('data-theme', d);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFoucScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AppFrame>{children}</AppFrame>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

The Cyrillic subset is included because alpha-fe ships Russian copy in screens like `select-timezone`.

- [ ] **Step 5: Create `app/loading.tsx`**

Assets are copied in Task 10, so the splash icon isn't on disk yet. Write a minimal version now; the full splash visual can be polished in Task 24.

```tsx
export default function Loading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100dvh', background: 'var(--color-bg)',
    }}>
      <span style={{ color: 'var(--color-text-muted)' }}>Loading…</span>
    </div>
  );
}
```

- [ ] **Step 6: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add -A
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(frame): global css, theme context, fonts, AppFrame, RootLayout

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Auth cookies + server-side proxy helper

**Files:**
- Create: `lib/auth/cookies.ts`, `lib/api/server.ts`

- [ ] **Step 1: Create `lib/auth/cookies.ts`**

```ts
import { cookies } from 'next/headers';

const AT = 'at';
const RT = 'rt';

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  // Access cookie: short TTL (1 hour is safe; backend may rotate sooner)
  store.set(AT, accessToken, { ...baseOptions, maxAge: 60 * 60 });
  // Refresh cookie: long TTL (30 days)
  store.set(RT, refreshToken, { ...baseOptions, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(AT);
  store.delete(RT);
}

export async function readAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AT)?.value ?? null;
}

export async function readRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(RT)?.value ?? null;
}
```

- [ ] **Step 2: Create `lib/api/server.ts`**

```ts
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
  const headers: Record<string, string> = { ...(init.headers ?? {}) };
  if (!init.noAuth && token) headers['Authorization'] = `Bearer ${token}`;
  // Strip hop-by-hop / browser-set headers we don't want forwarded.
  delete headers['host'];
  delete headers['connection'];
  delete headers['cookie'];
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

/**
 * Calls upstream with the current access token. On 401, refreshes once and retries.
 * On second 401 (or refresh failure), clears cookies.
 */
export async function upstreamWithRefresh(path: string, init: UpstreamInit = {}): Promise<Response> {
  const token = await readAccessToken();
  let res = await rawUpstream(path, init, token);
  if (res.status !== 401 || init.noAuth) return res;
  const refreshed = await tryRefresh();
  if (!refreshed) return res;
  const newToken = await readAccessToken();
  // Re-read body if init.body was a stream; assume callers pass a string/Buffer/undefined.
  res = await rawUpstream(path, init, newToken);
  return res;
}

/** Used by auth routes that need to talk upstream without sending the cookie token. */
export function upstreamNoAuth(path: string, init: Omit<UpstreamInit, 'noAuth'> = {}): Promise<Response> {
  return rawUpstream(path, { ...init, noAuth: true }, null);
}
```

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add lib/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(api): cookie helpers and upstream proxy with refresh

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Auth route handlers

**Files:** create one `route.ts` per endpoint.

- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/guest/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/refresh/route.ts`
- Create: `app/api/auth/me/route.ts`
- Create: `app/api/auth/forgot-password/route.ts`
- Create: `app/api/auth/reset-password/route.ts`
- Create: `app/api/auth/verify-email/route.ts`

- [ ] **Step 1: Login**

`app/api/auth/login/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { upstreamNoAuth } from '@/lib/api/server';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(req: Request) {
  const body = await req.json();
  const res = await upstreamNoAuth('/auth/login', {
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
```

- [ ] **Step 2: Register**

Same as login but POST to `/auth/register`. Body is `{ username, email, password }`. Note alpha-fe optionally passes the *current* access token when registering (to upgrade from guest); the upstream call should include `Authorization` if a cookie token exists.

`app/api/auth/register/route.ts`:

```ts
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
```

- [ ] **Step 3: Guest**

`app/api/auth/guest/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { upstreamNoAuth } from '@/lib/api/server';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST() {
  const res = await upstreamNoAuth('/auth/guest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
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
```

- [ ] **Step 4: Logout**

`app/api/auth/logout/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { upstreamNoAuth } from '@/lib/api/server';
import { readAccessToken, readRefreshToken, clearAuthCookies } from '@/lib/auth/cookies';

export async function POST() {
  const rt = await readRefreshToken();
  const at = await readAccessToken();
  if (rt && at) {
    // best-effort revoke
    await upstreamNoAuth('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${at}` },
      body: JSON.stringify({ refreshToken: rt }),
    }).catch(() => {});
  }
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 5: Refresh**

`app/api/auth/refresh/route.ts`:

```ts
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
  const tokens = await res.json();
  await setAuthCookies(tokens.accessToken, tokens.refreshToken);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Me**

`app/api/auth/me/route.ts`:

```ts
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
```

- [ ] **Step 7: Forgot / Reset / Verify-email**

Each is a stateless forward to the matching upstream endpoint. Verify-email needs the access token (it's an authenticated action), forgot/reset don't.

`app/api/auth/forgot-password/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { upstreamNoAuth } from '@/lib/api/server';

export async function POST(req: Request) {
  const body = await req.text();
  const res = await upstreamNoAuth('/auth/password/forgot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  return new NextResponse(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
```

`app/api/auth/reset-password/route.ts`: identical but to `/auth/password/reset`.

`app/api/auth/verify-email/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { upstreamWithRefresh } from '@/lib/api/server';

export async function POST(req: Request) {
  const body = await req.text();
  const res = await upstreamWithRefresh('/auth/email/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  return new NextResponse(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
```

Note: alpha-fe also has `sendVerification` (`POST /auth/email/send-verification`). Add that to the generic proxy or as a sibling route — for simplicity expose it via the generic proxy (Task 7), not here.

- [ ] **Step 8: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/api/auth/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(api): auth route handlers (login, register, guest, logout, refresh, me, forgot/reset/verify)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Generic API proxy + middleware

**Files:**
- Create: `app/api/[...path]/route.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Generic proxy**

`app/api/[...path]/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { upstreamWithRefresh } from '@/lib/api/server';

async function forward(req: NextRequest, params: { path: string[] }) {
  // `path` is the captured catch-all. The auth/* routes win over this because they're more specific.
  const subpath = '/' + params.path.join('/');
  const search = req.nextUrl.search;
  const upstreamPath = subpath + search;

  const headers: Record<string, string> = {};
  const ct = req.headers.get('Content-Type');
  if (ct) headers['Content-Type'] = ct;

  // Body: skip for GET/HEAD/DELETE; for others read as text or buffer.
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
```

Note: Next App Router prefers more specific routes over catch-alls, so `app/api/auth/login/route.ts` wins for `/api/auth/login`. The catch-all handles `/api/courses/get-list`, `/api/users/streak`, etc.

- [ ] **Step 2: Middleware**

`middleware.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next internals, API routes, static files (matcher below already filters these).
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
    // Match everything except Next internals, API, and common static files.
    '/((?!_next/|api/|favicon.ico|icon.png|apple-icon.png|images/).*)',
  ],
};
```

Note: `at` cookie presence is *necessary* but not *sufficient* — the proxy still validates with the upstream and refreshes on 401. Middleware is a fast happy-path gate; the proxy is the real authority.

Note: We treat the *guest* token as "auth" for middleware purposes — a guest session is still a session and lets the user browse the catalog. Logged-out users (no cookie at all) get redirected to login.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/api middleware.ts
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(api): generic /api/* proxy and auth middleware

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Port types/, client api, utils, streakCache, timezone

**Files:**
- Create: `types/api.ts`, `types/lesson.ts`, `lib/api/index.ts`, `lib/api/streakCache.ts`, `lib/api/timezone.ts`, `lib/utils/plural.ts`

- [ ] **Step 1: Copy types verbatim**

```bash
mkdir -p /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/types
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/types/api.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/types/lesson.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/types/
```

- [ ] **Step 2: Create `lib/api/index.ts`**

Read `alpha-fe/services/api.ts` for the exhaustive `api` object shape. Port it with these mechanical edits:
- `BASE_URL = ''` and call paths become `/api/...`.
- Drop the `token` parameter from every method.
- Add `credentials: 'include'` on every fetch.
- `ApiError` is unchanged.

```ts
import {
  ApiLessonDetail, ApiModuleDetail, ApiProgress, ActivityResponse, CoursesListResponse,
  StreakResponse, BundleListItem, PaymentInitiation, PaymentPreview, PaymentStatusInfo,
} from '@/types/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface AuthUser {
  userId: number;
  username: string;
  email: string | null;
  isEmailVerified: boolean;
  isGuest: boolean;
}

async function call<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new ApiError(res.status, data.error || `Request error: ${res.status}`);
  return data as T;
}

const post = <T>(endpoint: string, body?: object) =>
  call<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : '{}' });
const get = <T>(endpoint: string) => call<T>(endpoint, { method: 'GET' });

export const api = {
  auth: {
    register: (username: string, email: string, password: string) =>
      post<AuthUser>('/api/auth/register', { username, email, password }),
    login: (usernameOrEmail: string, password: string) =>
      post<AuthUser>('/api/auth/login', { usernameOrEmail, password }),
    guest: () => post<AuthUser>('/api/auth/guest'),
    logout: () => post<{ ok: true }>('/api/auth/logout'),
    me: () => get<AuthUser>('/api/auth/me'),
    sendVerification: () => post<void>('/api/auth/email/send-verification'),
    verifyEmail: (code: string) => post<void>('/api/auth/verify-email', { code }),
    forgotPassword: (email: string) => post<void>('/api/auth/forgot-password', { email }),
    resetPassword: (email: string, code: string, newPassword: string) =>
      post<void>('/api/auth/reset-password', { email, code, newPassword }),
  },
  users: {
    me: () => get<AuthUser>('/api/users/me'),
  },
  courses: {
    getList: () => post<CoursesListResponse>('/api/courses/get-list'),
  },
  modules: {
    getInfo: (id: number) => post<ApiModuleDetail>('/api/modules/get-info', { id }),
  },
  bundles: {
    getList: () => post<{ items: BundleListItem[] }>('/api/bundles/get-list'),
    getInfo: (id: number) => post<BundleListItem>('/api/bundles/get-info', { id }),
  },
  yookassaPayments: {
    preview: (kind: 'module' | 'bundle', id: number) =>
      post<PaymentPreview>('/api/yookassa-payments/preview', { kind, id }),
    initiate: (kind: 'module' | 'bundle', id: number) =>
      post<PaymentInitiation>('/api/yookassa-payments/initiate', { kind, id }),
    getStatus: (paymentId: number) =>
      post<PaymentStatusInfo>('/api/yookassa-payments/get-status', { paymentId }),
  },
  lessons: {
    getInfo: (id: number) => post<ApiLessonDetail>('/api/lessons/get-info', { id }),
  },
  progress: {
    upsert: (lessonId: number, status: 'Active' | 'Done', body: any) =>
      post<ApiProgress>('/api/progress/upsert', { lessonId, status, body }),
  },
  streak: {
    get: () => get<StreakResponse>('/api/users/streak'),
    getActivity: (from: string, to: string) =>
      post<ActivityResponse>('/api/users/activity', { from, to }),
    updateTimezone: (timezoneOffset: string) =>
      post<void>('/api/users/timezone/update', { timezoneOffset }),
  },
};
```

Note: `/api/auth/email/send-verification` and `/api/users/me` flow through the generic proxy (Task 7). No dedicated route needed.

- [ ] **Step 3: Copy `streakCache.ts`, `timezone.ts`, `plural.ts`**

```bash
mkdir -p /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/lib/utils
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/services/streakCache.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/lib/api/streakCache.ts
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/services/timezone.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/lib/api/timezone.ts
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/utils/plural.ts \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/lib/utils/plural.ts
```

Open each file. If any uses `react-native` or `expo-*` imports, replace per the swap table at the top of this plan. `streakCache.ts` likely uses `AsyncStorage` or in-memory cache — if it uses RN AsyncStorage, swap for `localStorage` on the client (gate with `typeof window !== 'undefined'`). If it's just an in-memory module-scope cache, no changes needed. `timezone.ts` likely just uses `Date#getTimezoneOffset`, which works on web unchanged.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add types lib
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(api): client api, types, utils

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: AuthContext and SpeakerContext (client)

**Files:**
- Create: `contexts/AuthContext.tsx`, `contexts/SpeakerContext.tsx`

- [ ] **Step 1: Port `AuthContext.tsx`**

The web version is much simpler: no SecureStore, no token state, no refresh logic (the proxy handles it). `withAuth`/`withAuthOrGuest`/`ensureGuest`/`callMaybeAuthed` are kept (consumers call them) but the callbacks lose the `token` parameter.

```tsx
'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api, ApiError, AuthUser } from '@/lib/api';
import { getDeviceTimezoneOffset } from '@/lib/api/timezone';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  /** Cookie-based: token is implicit. Callback takes no arguments. */
  withAuth: <T>(apiCall: () => Promise<T>) => Promise<T>;
  ensureGuest: () => Promise<void>;
  withAuthOrGuest: <T>(apiCall: () => Promise<T>) => Promise<T>;
  callMaybeAuthed: <T>(apiCall: () => Promise<T>) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const guestPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => { (async () => {
    try {
      const me = await api.auth.me();
      setUser(me);
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401)) console.warn('me failed:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  })(); }, []);

  async function login(usernameOrEmail: string, password: string) {
    const me = await api.auth.login(usernameOrEmail, password);
    setUser(me);
  }

  async function register(username: string, email: string, password: string) {
    const me = await api.auth.register(username, email, password);
    setUser(me);
    api.streak.updateTimezone(getDeviceTimezoneOffset()).catch(() => {});
  }

  async function logout() {
    try { await api.auth.logout(); } catch { /* best-effort */ }
    setUser(null);
  }

  async function verifyEmail(code: string) {
    await api.auth.verifyEmail(code);
    if (user) setUser({ ...user, isEmailVerified: true });
  }
  async function resendVerification() { await api.auth.sendVerification(); }
  async function forgotPassword(email: string) { await api.auth.forgotPassword(email); }
  async function resetPassword(email: string, code: string, newPassword: string) {
    await api.auth.resetPassword(email, code, newPassword);
    try { await login(email, newPassword); } catch { throw new Error('PASSWORD_RESET_LOGIN_FAILED'); }
  }

  async function withAuth<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
      return await apiCall();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        throw new ApiError(401, 'Session expired. Please log in again.');
      }
      throw err;
    }
  }

  async function ensureGuest(): Promise<void> {
    if (user) return;
    if (guestPromiseRef.current) return guestPromiseRef.current;
    guestPromiseRef.current = (async () => {
      const me = await api.auth.guest();
      setUser(me);
    })().finally(() => { guestPromiseRef.current = null; });
    return guestPromiseRef.current;
  }

  async function withAuthOrGuest<T>(apiCall: () => Promise<T>): Promise<T> {
    if (!user) await ensureGuest();
    return withAuth(apiCall);
  }

  async function callMaybeAuthed<T>(apiCall: () => Promise<T>): Promise<T> {
    return withAuth(apiCall);
  }

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      login, register, logout,
      verifyEmail, resendVerification, forgotPassword, resetPassword,
      withAuth, ensureGuest, withAuthOrGuest, callMaybeAuthed,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 2: Port `SpeakerContext.tsx`**

Open `alpha-fe/context/SpeakerContext.tsx`. It's small (~57 lines). Port verbatim with these edits:
- Add `'use client';` at top.
- Replace `import { Platform } from 'react-native'` and `AsyncStorage`/`SecureStore` with `localStorage` (gated by `typeof window !== 'undefined'`).
- Keep the same exported names (`SpeakerProvider`, `useSpeaker`).

- [ ] **Step 3: Wire providers into `RootLayout`**

Edit `app/layout.tsx`. Add the two new providers inside `ThemeProvider`:

```tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { SpeakerProvider } from '@/contexts/SpeakerContext';

// ...inside <body>:
<ThemeProvider>
  <AuthProvider>
    <SpeakerProvider>
      <AppFrame>{children}</AppFrame>
    </SpeakerProvider>
  </AuthProvider>
</ThemeProvider>
```

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add contexts app/layout.tsx
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(contexts): port AuthContext (cookie-based) and SpeakerContext

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Copy assets to public/

**Files:**
- Create: `public/images/*` (everything in `alpha-fe/assets/images/`), `app/icon.png`, `app/apple-icon.png`, `public/favicon.ico`

- [ ] **Step 1: Copy images**

```bash
mkdir -p /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/public/images
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/assets/images/* \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/public/images/
```

- [ ] **Step 2: Set up Next metadata icons**

```bash
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/assets/images/icon.png \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/app/icon.png
cp /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/assets/images/icon.png \
   /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/app/apple-icon.png
```

- [ ] **Step 3: Favicon**

Generate `public/favicon.ico` from `public/images/favicon.png`. Easiest is to copy `favicon.png` to `app/icon.png` (Next auto-generates the favicon route) — already done in step 2. Skip explicit `.ico` for now; revisit in Task 24 if the browser tab still shows the Next default.

- [ ] **Step 4: Verify and commit**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add public app/icon.png app/apple-icon.png
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
chore(assets): copy images and set app icons

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Port all SVG icons (components/icons/)

**Files (23):** Create one `.tsx` per icon, same filename as source.

`BackIcon, BellIcon, BookIcon, CheckIcon, ChevronDownIcon, ClockIcon, CrossIcon, EyeIcon, EyeOffIcon, ForwardIcon, HomeIcon, LockIcon, LogoIcon, ModulesIcon, PlayIcon, PlusIcon, ProfileIcon, SettingsIcon, SparkleIcon, SpeakerIcon, StarIcon, SunIcon, UsersIcon, ZapIcon`.

All sources are in `alpha-fe/components/icons/`. Each uses `react-native-svg` (`<Svg>`, `<Path>`, `<Circle>`, etc.).

- [ ] **Step 1: Establish the port pattern (do `BackIcon` first as reference)**

Read `alpha-fe/components/icons/BackIcon.tsx`. Convert one-to-one:
- `import Svg, { Path } from 'react-native-svg'` → drop, use native `<svg>`/`<path>`.
- `<Svg ...props>` → `<svg ...props>` (lowercase JSX).
- All props camelCase from `react-native-svg` (e.g. `strokeWidth`) stay the same in JSX SVG.
- RN style `width={20} height={20}` → use width/height props as numbers or strings, identical.
- Keep `viewBox`, `fill`, `stroke` etc.

Example destination shape (adapt to actual icon):

```tsx
interface IconProps {
  size?: number;
  color?: string;
}

export function BackIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="..." stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

- [ ] **Step 2: Port the remaining 22 icons**

Apply the same mechanical transform. Keep the exported component name (`BackIcon`, `BellIcon`, etc.) and prop shape identical.

- [ ] **Step 3: Spot-check by rendering on the home page**

Temporarily replace `app/page.tsx` with:

```tsx
import { HomeIcon } from '@/components/icons/HomeIcon';
import { BellIcon } from '@/components/icons/BellIcon';
// ...import a few

export default function Home() {
  return (
    <main style={{ padding: 16, display: 'flex', gap: 16 }}>
      <HomeIcon /><BellIcon /><HomeIcon color="red" size={32} />
    </main>
  );
}
```

Run `npm run dev`, open in mobile viewport, confirm icons render. Then revert `app/page.tsx` to the original placeholder.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add components/icons app/page.tsx
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(icons): port 23 svg icons from alpha-fe

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Port `components/ui/`

**Files (9):** `BulletItem, ChatWindow, DosDonts, HighlightBlock, NoteBlock, ProgressDots, SkillBadge, TagBadge, collapsible`.

For each: create `Foo.tsx` + `Foo.module.css` in `alpha-web-fe/components/ui/`. Apply the standard swaps from the working notes.

- [ ] **Step 1: Port `BulletItem`, `ProgressDots`, `SkillBadge`, `TagBadge`, `HighlightBlock`, `NoteBlock`, `collapsible`**

These are simple presentation components. For each:
1. Read the alpha-fe source.
2. Create the `.tsx` (no `'use client'` unless it has state, click handlers, or refs).
3. Create the `.module.css` with translated `StyleSheet` keys.

- [ ] **Step 2: Port `DosDonts`**

Slightly more complex (two-column layout). Same approach.

- [ ] **Step 3: Port `ChatWindow`**

Uses `react-native-reanimated` for message reveal. Replace with Framer Motion:

```tsx
'use client';
import { motion, AnimatePresence } from 'motion/react';
// ...
<AnimatePresence initial={false}>
  {messages.map((m, i) => (
    <motion.div
      key={m.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: i * 0.05 }}
    >
      {/* message body */}
    </motion.div>
  ))}
</AnimatePresence>
```

Match the staggering timing from the original.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add components/ui
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(ui): port 9 ui primitives

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Port `components/bp/` (brand components)

**Files (20):** `BPBundlesCTA, BPCard, BPContinueModuleCard, BPHeroAvatar, BPLessonNode, BPModulesShelf, BPPageHeader, BPPillButton, BPProgressBar, BPRecommendedModuleCard, BPRoadmapNode, BPSectionTitle, BPSoftCard, BPStatBox, BPStreakCard, BPTabBar, BPThoughtCard, BPTopBar, QuoteOrb, SpeakerSpriteAvatar`.

- [ ] **Step 1: Port the leaf components first**

Order: `BPSoftCard, BPCard, BPPillButton, BPSectionTitle, BPStatBox, BPProgressBar, BPTopBar, BPPageHeader, BPThoughtCard, QuoteOrb`.

Apply standard swaps. Most use `LinearGradient` from `expo-linear-gradient` — replace with a CSS `background: linear-gradient(...)`. Most use a `Pressable` — replace with `<button type="button">`.

- [ ] **Step 2: Port `SpeakerSpriteAvatar` and `BPHeroAvatar`**

`SpeakerSpriteAvatar` uses a sprite from `assets/images/spritesheet.webp`. Implement as a `<div>` with CSS `background-image: url('/images/spritesheet.webp')` and `background-position` per frame index. If the source uses an animated sprite (cycling frames), use CSS keyframes:

```css
.sprite {
  width: 48px; height: 48px;
  background-image: url('/images/spritesheet.webp');
  animation: cycle 0.8s steps(N) infinite;
}
@keyframes cycle { from { background-position: 0 0; } to { background-position: -NN px 0; } }
```

`BPHeroAvatar` likely composes `SpeakerSpriteAvatar` plus a frame; port once dependencies are ready.

- [ ] **Step 3: Port `BPLessonNode`, `BPRoadmapNode`, `BPContinueModuleCard`, `BPRecommendedModuleCard`, `BPStreakCard`, `BPModulesShelf`, `BPBundlesCTA`**

These compose the leaves. Apply standard swaps.

- [ ] **Step 4: Port `BPTabBar` (the bottom navigation)**

`alpha-fe` uses `@react-navigation/bottom-tabs`. The web version is custom: read `usePathname()` from `next/navigation`, render an `<nav>` fixed to the bottom of the AppFrame with three icon buttons (Home / Modules / Profile), highlight the one whose pathname matches.

```tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ModulesIcon } from '@/components/icons/ModulesIcon';
import { ProfileIcon } from '@/components/icons/ProfileIcon';
import s from './BPTabBar.module.css';

const TABS = [
  { href: '/', label: 'Home', Icon: HomeIcon, match: (p: string) => p === '/' },
  { href: '/modules', label: 'Modules', Icon: ModulesIcon, match: (p: string) => p.startsWith('/modules') },
  { href: '/profile', label: 'Profile', Icon: ProfileIcon, match: (p: string) => p.startsWith('/profile') },
];

export function BPTabBar() {
  const pathname = usePathname();
  return (
    <nav className={s.bar}>
      {TABS.map(t => {
        const active = t.match(pathname);
        return (
          <Link key={t.href} href={t.href} className={active ? s.itemActive : s.item}>
            <t.Icon color={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

Visual styling (height, shadow, safe-area padding) should match the alpha-fe source. The bar must clear `env(safe-area-inset-bottom)`.

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add components/bp
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(bp): port 20 brand components

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Port miscellaneous components

**Files:** `parallax-scroll-view.tsx`, `hello-wave.tsx`, `themed-text.tsx`, `themed-view.tsx`, `haptic-tab.tsx`, `external-link.tsx`.

- [ ] **Step 1: Port `themed-text` and `themed-view`**

The originals consume `useColorScheme()` from RN and pick from `theme.light`/`theme.dark`. On web we don't need them at all because CSS variables already swap with `data-theme`. Port them as thin wrappers (`<p>` / `<div>`) that just apply CSS classes — preserve the exported names so existing imports work, even if internals become trivial.

- [ ] **Step 2: Port `external-link`**

```tsx
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
```

- [ ] **Step 3: Port `haptic-tab`**

The original wraps a tab button with haptic feedback. On web, the bottom tab bar is custom (`BPTabBar`) so `haptic-tab` may have no callers — search:

```bash
grep -rn "haptic-tab\|HapticTab" /Users/dinar.faiskhanov/Projects/alpha/alpha-fe/
```

If only the RN tab navigator uses it, you can skip the port. Otherwise port as a plain `<button type="button">` that ignores the haptic call.

- [ ] **Step 4: Port `hello-wave`**

Reanimated keyframe rotation → CSS keyframes:

```css
.wave {
  display: inline-block;
  animation: wave 1.6s ease-in-out 4;
  transform-origin: 70% 70%;
}
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(14deg); }
  50% { transform: rotate(0deg); }
}
```

- [ ] **Step 5: Port `parallax-scroll-view`**

Replace `Animated.ScrollView` + `Animated.event(... { useNativeDriver: true })` with Framer Motion + `useScroll`/`useTransform`:

```tsx
'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, ReactNode } from 'react';
import s from './parallax-scroll-view.module.css';

const HEADER_HEIGHT = 250;

export function ParallaxScrollView({ headerImage, headerBackgroundColor, children }: {
  headerImage: ReactNode;
  headerBackgroundColor: { light: string; dark: string };
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const translateY = useTransform(scrollY, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]);
  const scale = useTransform(scrollY, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]);

  return (
    <div ref={containerRef} className={s.scroll}>
      <motion.div className={s.header} style={{ translateY, scale }}>
        {headerImage}
      </motion.div>
      <div className={s.content}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 6: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add components/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(components): port misc (parallax, wave, themed, external-link, haptic-tab)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Auth screens — Login and Register

**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/login/page.module.css`, `app/(auth)/register/page.tsx`, `app/(auth)/register/page.module.css`.

- [ ] **Step 1: Port `login`**

Read `alpha-fe/app/login.tsx` (243 lines). Apply all standard swaps. Critical translation points:
- `'use client'` at top — every screen page needs this.
- `<Stack.Screen options={...}/>` lines: delete.
- `useRouter()` from `next/navigation`. After successful login, `router.replace(searchParams.get('next') ?? '/')`.
- Form submission via `<form onSubmit={...}>` + `e.preventDefault()`.
- `TextInput` → `<input>`. `secureTextEntry` → `type="password"`.
- `KeyboardAvoidingView` → drop; web keyboards handle this.

```tsx
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
// import design components as in alpha-fe
import s from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await login(username, password);
      router.replace(params.get('next') ?? '/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }
  // ...JSX matching the original layout, using design components and CSS module
}
```

Match every visible element from the original (logo, headings, helper text, "forgot password" link to `/forgot-password`, "register" link to `/register`, error display).

- [ ] **Step 2: Port `register`**

Same pattern. Source: `alpha-fe/app/register.tsx` (235 lines).

- [ ] **Step 3: Manually verify**

`npm run dev`, open `http://localhost:3000/login` in mobile viewport. The unauthed middleware should redirect you there from `/`. Try a real login against the production API (or skip until the backend is reachable from your dev environment).

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/\(auth\)/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(auth): port login and register screens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: Auth screens — Forgot/Reset/Verify

**Files:** `app/(auth)/forgot-password/page.tsx`, `app/(auth)/reset-password/page.tsx`, `app/(auth)/verify-email/page.tsx` (each with sibling `.module.css`).

- [ ] **Step 1: Port `forgot-password`**

Source: `alpha-fe/app/forgot-password.tsx` (203 lines). Apply the same standard swaps as Task 15. The flow: user submits email → call `forgotPassword(email)` → navigate to `/reset-password?email=<email>`.

- [ ] **Step 2: Port `reset-password`**

Source: `alpha-fe/app/reset-password.tsx` (234 lines). Uses `useLocalSearchParams<{ email: string }>()` → swap for `useSearchParams()` and `params.get('email')`.

- [ ] **Step 3: Port `verify-email`**

Source: `alpha-fe/app/verify-email.tsx` (208 lines). Uses `useAuth().verifyEmail` and `resendVerification` — both available unchanged.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/\(auth\)/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(auth): port forgot/reset/verify screens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Tabs shell, Home, Modules, Profile

**Files:**
- Create: `app/(tabs)/layout.tsx`, `app/(tabs)/layout.module.css`
- Replace: `app/(tabs)/page.tsx` (home)
- Create: `app/(tabs)/modules/page.tsx`, `app/(tabs)/profile/page.tsx`

Note: in App Router, the route group `(tabs)` doesn't appear in the URL — `(tabs)/page.tsx` serves `/`, `(tabs)/modules/page.tsx` serves `/modules`, etc.

Since we created `app/page.tsx` earlier as a placeholder, **move** it: rename `app/page.tsx` → `app/(tabs)/page.tsx`.

- [ ] **Step 1: Move the home placeholder under (tabs)**

```bash
mkdir -p /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe/app/\(tabs\)
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe mv app/page.tsx 'app/(tabs)/page.tsx'
```

- [ ] **Step 2: Create `(tabs)/layout.tsx`**

```tsx
import { BPTabBar } from '@/components/bp/BPTabBar';
import s from './layout.module.css';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.shell}>
      <div className={s.content}>{children}</div>
      <BPTabBar />
    </div>
  );
}
```

`layout.module.css`:

```css
.shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
  overflow: auto;
}
```

(72px is a placeholder; match the actual BPTabBar height from alpha-fe.)

- [ ] **Step 3: Port the home screen**

Source: `alpha-fe/app/(tabs)/index.tsx` (167 lines). Replace your placeholder `app/(tabs)/page.tsx` with the full port. Apply standard swaps. Most data fetching uses `useAuth().withAuthOrGuest(...)` → callback now takes no args.

- [ ] **Step 4: Port the modules tab**

Source: `alpha-fe/app/(tabs)/modules.tsx` (274 lines). Same swaps. Save as `app/(tabs)/modules/page.tsx`.

- [ ] **Step 5: Port the profile tab**

Source: `alpha-fe/app/(tabs)/profile.tsx` (205 lines). Save as `app/(tabs)/profile/page.tsx`. Uses `useAuth().logout` and `useAuth().user` directly — straightforward.

- [ ] **Step 6: Manually verify**

`npm run dev` → log in → confirm tabs render, navigation works between them, BPTabBar highlights the active tab.

- [ ] **Step 7: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/\(tabs\)/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(tabs): tabs layout with BPTabBar, port home/modules/profile

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 18: Course and Module detail screens

**Files:**
- Create: `app/course/[id]/page.tsx`, `app/course/[id]/page.module.css`
- Create: `app/module/[id]/page.tsx`, `app/module/[id]/page.module.css`
- Create: `app/module/[id]/_components/BuyModuleCard.tsx`, `BuyModuleInlineCard.tsx`, `LessonsTab.tsx` (plus `.module.css` each)

- [ ] **Step 1: Port the three `_components`**

Sources are in `alpha-fe/app/module/_components/`. Standard swaps. `_components` (underscore) keeps Next from routing them.

- [ ] **Step 2: Port `course/[id]/page.tsx`**

Source: `alpha-fe/app/course/[id].tsx`. Standard swaps. Param via:

```tsx
import { useParams } from 'next/navigation';
const { id } = useParams<{ id: string }>();
const courseId = Number(id);
```

- [ ] **Step 3: Port `module/[id]/page.tsx`**

Source: `alpha-fe/app/module/[id].tsx`. Same param treatment.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/course app/module
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(screens): port course and module detail screens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: Settings, Streak, Roadmap, Select-Speaker, Select-Timezone, Modal

**Files (one page per screen):**
- `app/settings/page.tsx`
- `app/streak/page.tsx`
- `app/roadmap/page.tsx`
- `app/select-speaker/page.tsx`
- `app/select-timezone/page.tsx`
- `app/modal/page.tsx`

- [ ] **Step 1: Port `settings`**

Source: `alpha-fe/app/settings.tsx` (201 lines). Standard swaps. Includes the theme picker — wire it to `useTheme().setPref`. Logout button calls `useAuth().logout()` then `router.replace('/login')`.

- [ ] **Step 2: Port `streak`**

Source: `alpha-fe/app/streak.tsx` (277 lines). Uses `streakCache`, `useAuth().withAuth`. Apply swaps.

- [ ] **Step 3: Port `roadmap`**

Source: `alpha-fe/app/roadmap.tsx` (245 lines). Standard swaps.

- [ ] **Step 4: Port `select-speaker` and `select-timezone`**

Sources: `alpha-fe/app/select-speaker.tsx` (68 lines), `alpha-fe/app/select-timezone.tsx` (94 lines). Simple selection screens. `select-speaker` uses `useSpeaker().setSpeaker`.

- [ ] **Step 5: Port `modal`**

Source: `alpha-fe/app/modal.tsx` (54 lines). For v1 this becomes a regular page; we don't implement the parallel-route overlay behavior (deferred per spec §5.1).

- [ ] **Step 6: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(screens): port settings, streak, roadmap, select-speaker/timezone, modal

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 20: Lesson base components

**Files:**
- `components/lesson/LessonCard.tsx` + `.module.css`
- `components/lesson/LessonHeader.tsx` + `.module.css`
- `components/lesson/LessonStreak.tsx` + `.module.css`
- `components/lesson/ModuleSkills.tsx` + `.module.css`
- `components/lesson/cardReadiness.ts`
- `components/lesson/icons/LessonGlyphs.tsx`
- `components/LessonList.tsx` + `.module.css` (lives one level up in source)
- `components/LessonListItem.tsx` + `.module.css`

- [ ] **Step 1: Copy `cardReadiness.ts` verbatim**

Pure logic; no UI deps.

- [ ] **Step 2: Port `LessonGlyphs.tsx`**

Same as the `icons/` port pattern (Task 11) — convert `react-native-svg` to native `<svg>`. This file usually contains multiple glyph components.

- [ ] **Step 3: Port the 4 lesson UI components and the 2 lesson list components**

Apply standard swaps. `LessonStreak` may use animation — use Framer Motion if needed.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add components/lesson components/LessonList.tsx components/LessonListItem.tsx
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(lesson): port lesson base components and list

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 21: Lesson step components (15 files)

**Files (each `.tsx` + `.module.css` in `components/lesson/steps/`):**

`StepChallenge, StepChat, StepComic, StepInsight, StepIntro, StepMentor, StepMindmap, StepRealityCheck, StepReveal, StepSpeaker, StepStats, StepStrategy, StepSummary, StepTimeline, StepVoices`.

- [ ] **Step 1: Port the static / low-animation steps**

Group: `StepInsight, StepIntro, StepSummary, StepStats, StepStrategy, StepRealityCheck, StepReveal, StepTimeline, StepMentor, StepVoices, StepMindmap, StepComic, StepChallenge`.

Each is a presentation component. Apply standard swaps. Most consume `LessonGlyphs` and `ui/*` primitives ported earlier.

- [ ] **Step 2: Port `StepChat`**

Uses `ChatWindow` (already ported in Task 12). Straightforward.

- [ ] **Step 3: Port `StepSpeaker`**

Uses sprite animation. Use the CSS keyframe sprite technique from Task 13 Step 2 (the `SpeakerSpriteAvatar` is already available — likely reuse it directly).

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add components/lesson/steps
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(lesson): port 15 lesson step components

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 22: Lesson test components (7 files)

**Files (each `.tsx` + `.module.css` in `components/lesson/tests/`):**

`BasicTest, TestBeforeAfter, TestChat, TestDragRank, TestQuickFire, TestStory, TestSwipe`.

- [ ] **Step 1: Port `BasicTest`, `TestStory`, `TestBeforeAfter`, `TestChat`**

Standard swaps. `TestChat` may reuse `ChatWindow`.

- [ ] **Step 2: Port `TestQuickFire`**

Uses Reanimated for a countdown bar and answer-feedback flash. Replace with Framer Motion + a `useEffect` interval for the countdown:

```tsx
'use client';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const DURATION_MS = 5000;

export function TestQuickFire(/* props */) {
  // const [remaining, setRemaining] = useState(DURATION_MS);
  // useEffect: interval/timeout to tick down, call onTimeout when zero
  // <motion.div style={{ width: pct + '%' }} initial={...} animate={...} />
}
```

Match the original timing and visuals.

- [ ] **Step 3: Port `TestSwipe`**

Reanimated gesture handler → Framer Motion `motion.div drag="x"`:

```tsx
'use client';
import { motion, useMotionValue, useTransform } from 'motion/react';

export function TestSwipe(/* props */) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onSwipeRight();
        else if (info.offset.x < -120) onSwipeLeft();
      }}
    >
      {/* card content */}
    </motion.div>
  );
}
```

- [ ] **Step 4: Port `TestDragRank`**

Reanimated drag-to-reorder → Framer Motion `Reorder.Group` / `Reorder.Item`:

```tsx
'use client';
import { Reorder } from 'motion/react';

export function TestDragRank({ items, onChange }: { items: Item[]; onChange: (next: Item[]) => void }) {
  return (
    <Reorder.Group axis="y" values={items} onReorder={onChange}>
      {items.map(item => (
        <Reorder.Item key={item.id} value={item}>{item.label}</Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
```

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add components/lesson/tests
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(lesson): port 7 lesson test components

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 23: Lesson runner page

**Files:**
- Create: `app/lesson/[id]/page.tsx`, `app/lesson/[id]/page.module.css`

- [ ] **Step 1: Port the lesson page**

Source: `alpha-fe/app/lesson/[id].tsx`. This is the orchestrator that loads the lesson, walks steps/tests, calls `progress.upsert`. Apply standard swaps. Param via `useParams<{ id: string }>()`.

- [ ] **Step 2: Manually verify end-to-end**

`npm run dev`, log in, navigate Home → Modules → pick a module → open a lesson. Walk through several steps and the test, confirm progress updates persist (reload the lesson, state restored).

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/lesson
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
feat(lesson): port lesson runner page

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 24: Polish — dark theme, safe-area, metadata, README

**Files:**
- Modify: `app/globals.css` (any dark-theme tweaks)
- Modify: `app/layout.tsx` (final metadata)
- Modify: `README.md`
- Create / verify: `app/icon.png`, `app/apple-icon.png` already in Task 10

- [ ] **Step 1: Dark theme audit**

Toggle dark mode in Settings. Walk every screen. For each color that looks wrong:
- Find the offending hard-coded color in the CSS module.
- Replace with a `var(--color-*)` from `globals.css`. If the variable doesn't exist, add it (with values for both light and dark sets, sourced from `theme.dark` in `constants/theme.ts`).

- [ ] **Step 2: Safe-area review**

On iOS Safari (or a desktop browser with notch emulation), confirm:
- Page headers don't sit under the status bar.
- `BPTabBar` doesn't sit under the home indicator.
- Auth screens have safe-area top padding.

Fix by adding `padding-top: env(safe-area-inset-top)` / `padding-bottom: env(safe-area-inset-bottom)` to the right CSS classes.

- [ ] **Step 3: Animation polish**

For each Framer Motion replacement, eyeball it against the RN original. Adjust durations/easings to match.

- [ ] **Step 4: Reduced motion**

Add to `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 5: Update `README.md`**

```markdown
# alpha-web-fe

Web port of the alpha-fe mobile app. Next.js 15 (App Router), React 19, TypeScript.

## Quick start

\`\`\`bash
cp .env.example .env.local   # edit ALPHA_API_URL if needed
npm install
npm run dev                  # http://localhost:3000
\`\`\`

## Notes

- Mobile-only viewport for v1. The UI is centered in a 430px column on desktop.
- Auth tokens live in httpOnly cookies; the browser only talks to /api/* (proxied to the upstream API).
- Dark/light theme follows `prefers-color-scheme`; override in Settings.

## Layout

- `app/` — App Router pages, `(auth)/`, `(tabs)/`, detail routes, and `/api/*` proxy.
- `components/{icons,ui,bp,lesson,frame}` — design system, ported 1:1 from alpha-fe.
- `contexts/` — Auth, Speaker, Theme.
- `lib/api/` — client (`index.ts`) and server (`server.ts`) API layers.
- `constants/`, `types/` — token/type sources of truth.

## Design spec

See `docs/superpowers/specs/2026-05-24-alpha-web-fe-design.md`.
```

- [ ] **Step 6: Verify and commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add -A
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "$(cat <<'EOF'
chore: polish (dark theme, safe-area, reduced motion, README)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Done

You should now have a working `alpha-web-fe` at `http://localhost:3000` that mirrors `alpha-fe` screen-for-screen on a mobile viewport. Real users on a phone see edge-to-edge; desktop sees the same UI in a centered phone-width column.

Likely follow-ups (out of v1 scope):
- Real desktop layouts.
- PWA install / offline.
- Test suite.
- Analytics / Sentry.
- True modal route via parallel routes.
