# alpha-web-fe — Design Spec

**Date:** 2026-05-24
**Status:** Approved (brainstorming) — ready for implementation planning
**Source app being ported:** `alpha-fe` (React Native + Expo Router, ~3.7k LOC of screen/context code, plus shared design-system components)
**Target:** `alpha-web-fe` (Next.js web app, mobile viewport only for v1)

## 1. Goal

Build `alpha-web-fe` as a Next.js web app that is a full 1:1 port of the existing React Native mobile app `alpha-fe`:

- Same pages (every route in `alpha-fe/app/`).
- Same logic (same API contract, same auth flow, same context shape).
- Same visual design (same palette, typography, shadows, component look).
- Same assets (icons, sprites, images).

v1 ships **mobile only**. Desktop layouts are deferred. On desktop viewports the mobile UI is shown inside a centered phone-width column.

## 2. Non-goals (v1)

- Real desktop layouts.
- Native-only capabilities: push notifications, OTA updates, haptics, native splash, biometric auth.
- Any feature `alpha-fe` does not already have.
- SSR data fetching beyond what individual screens already do client-side. Screens remain client components for parity; SSR can be introduced selectively later.
- Automated tests (deferred by user; rely on type-check + lint + visual QA for v1).
- PWA install / offline / service worker.
- Analytics, error monitoring (e.g., Sentry).

## 3. Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript (strict).
- **Styling:** CSS Modules per component + a single `app/globals.css` exposing palette/shadow tokens as CSS variables. Light/dark sets keyed off `[data-theme="light|dark"]` on `<html>`.
- **Fonts:** Manrope via `next/font/google` (mirrors `@expo-google-fonts/manrope`).
- **Icons:** All custom icons in `alpha-fe/components/icons/` ported as native `<svg>` React components, same filenames.
- **State:** React Context only — `AuthContext`, `SpeakerContext`, `ThemeContext` (same shape as alpha-fe). No additional server-state library.
- **HTTP:** Native `fetch`. No client-side `BASE_URL` — calls go to `/api/*` proxied by Next.
- **Animations:** Framer Motion (`motion`) where animation is meaningful; CSS transitions for trivial ones. Respects `prefers-reduced-motion`.
- **Auth storage:** httpOnly cookies set by Next route handlers (tokens never visible to JS).
- **Package manager:** npm.
- **Lint:** Next default ESLint config.

## 4. Repo layout

```
alpha-web-fe/
├─ app/
│  ├─ layout.tsx                  RootLayout: providers, fonts, AppFrame
│  ├─ loading.tsx                 splash equivalent
│  ├─ globals.css                 resets + CSS variables
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  ├─ register/page.tsx
│  │  ├─ forgot-password/page.tsx
│  │  ├─ reset-password/page.tsx
│  │  └─ verify-email/page.tsx
│  ├─ (tabs)/
│  │  ├─ layout.tsx               bottom BPTabBar + children
│  │  ├─ page.tsx                 home (index)
│  │  ├─ modules/page.tsx
│  │  └─ profile/page.tsx
│  ├─ course/[id]/page.tsx
│  ├─ module/[id]/
│  │  ├─ page.tsx
│  │  └─ _components/             BuyModuleCard, BuyModuleInlineCard, LessonsTab
│  ├─ lesson/[id]/page.tsx
│  ├─ roadmap/page.tsx
│  ├─ settings/page.tsx
│  ├─ streak/page.tsx
│  ├─ select-speaker/page.tsx
│  ├─ select-timezone/page.tsx
│  ├─ modal/page.tsx
│  └─ api/
│     ├─ auth/{login,register,logout,refresh,me,forgot-password,reset-password,verify-email}/route.ts
│     └─ [...path]/route.ts       generic proxy to api.beprime.pro
├─ components/
│  ├─ bp/                         1:1 port of alpha-fe/components/bp/
│  ├─ ui/                         1:1 port of alpha-fe/components/ui/
│  ├─ lesson/                     LessonCard, LessonHeader, LessonStreak, ModuleSkills,
│  │                              cardReadiness.ts, icons/LessonGlyphs.tsx,
│  │                              steps/ (15 files), tests/ (7 files)
│  ├─ icons/                      all SVG icons
│  └─ frame/AppFrame.tsx          max-width 430px centered shell
├─ contexts/                      AuthContext, SpeakerContext, ThemeContext
├─ lib/
│  ├─ api/
│  │  ├─ index.ts                 client-facing API functions (1:1 with services/api.ts)
│  │  ├─ server.ts                serverFetch helper used by route handlers
│  │  ├─ streakCache.ts
│  │  └─ timezone.ts
│  ├─ auth/cookies.ts             server-side cookie helpers
│  └─ utils/plural.ts
├─ constants/                     palette.ts, theme.ts, shadows.ts, speakers.ts, timezones.ts
├─ types/                         api.ts, lesson.ts (copied verbatim)
├─ public/
│  ├─ images/                     copied from alpha-fe/assets/images/
│  └─ favicon.ico
├─ middleware.ts                  auth gating
├─ next.config.ts
├─ tsconfig.json                  strict, paths: "@/*"
├─ package.json
└─ README.md
```

Underscore-prefixed `_components` folders keep Next from treating them as routes; same idiom as `alpha-fe/app/module/_components/`.

## 5. Routing & navigation

### 5.1 Route map (Expo Router → Next App Router)

| alpha-fe | alpha-web-fe |
|---|---|
| `app/_layout.tsx` (Stack) | `app/layout.tsx` (providers + AppFrame) |
| `app/(tabs)/_layout.tsx` (Tabs) | `app/(tabs)/layout.tsx` (renders `<BPTabBar/>` + children) |
| `app/(tabs)/index.tsx` | `app/(tabs)/page.tsx` |
| `app/(tabs)/modules.tsx` | `app/(tabs)/modules/page.tsx` |
| `app/(tabs)/profile.tsx` | `app/(tabs)/profile/page.tsx` |
| `app/course/[id].tsx` | `app/course/[id]/page.tsx` |
| `app/lesson/[id].tsx` | `app/lesson/[id]/page.tsx` |
| `app/module/[id].tsx` | `app/module/[id]/page.tsx` |
| `app/login.tsx`, `register.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `verify-email.tsx` | `app/(auth)/<screen>/page.tsx` |
| `app/settings.tsx`, `streak.tsx`, `roadmap.tsx`, `select-speaker.tsx`, `select-timezone.tsx` | `app/<screen>/page.tsx` |
| `app/modal.tsx` | `app/modal/page.tsx` (regular page; can upgrade to parallel route later) |

### 5.2 Auth gating

`middleware.ts` reads the `at` httpOnly cookie:

- Missing on a protected route → redirect to `/login`.
- Present on `(auth)/*` → redirect to `/`.
- Protected = everything except `(auth)/*` and Next's internal/asset paths.

### 5.3 Navigation primitives

- `next/link` for declarative navigation.
- `useRouter()` from `next/navigation` for imperative (`replace` post-login, `back` on detail screens).

## 6. Mobile frame

`AppFrame` lives in `app/layout.tsx` and wraps every page.

- Inner container: `max-width: 430px; min-height: 100dvh; margin: 0 auto; position: relative; background: var(--bg);`
- Outer body fills viewport with `var(--bg-surround)` so the column is visible on desktop.
- Safe-area: `padding-block: env(safe-area-inset-top) env(safe-area-inset-bottom)` on tab bar and headers.
- `(tabs)` layout reserves bottom space equal to the fixed `BPTabBar` height.
- Viewport meta: `viewport-fit=cover, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` — matches mobile-app feel and prevents iOS Safari input zoom.
- `theme-color` meta tag swaps with light/dark theme so iOS Safari chrome matches the page header (closest web equivalent to `expo-status-bar`).

## 7. API proxy & auth

### 7.1 Goal

Browser only talks to `/api/*` on the Next app. Tokens never enter JavaScript — they live in httpOnly cookies.

### 7.2 Cookies

| Name | Purpose | Attributes |
|---|---|---|
| `at` | access token | httpOnly, Secure, SameSite=Lax, short-lived (matches backend access TTL) |
| `rt` | refresh token | httpOnly, Secure, SameSite=Lax, long-lived |

No client-readable auth state. `AuthContext` learns the user via `GET /api/auth/me`.

### 7.3 Auth route handlers (`app/api/auth/*`)

| Route | Behavior |
|---|---|
| `POST /api/auth/login` | Forwards `{username, password}` to upstream `/auth/login`. On success: set `at` + `rt` cookies, return `{userId, username, email, isEmailVerified, isGuest}` (no tokens in JSON). |
| `POST /api/auth/register` | Same pattern. |
| `POST /api/auth/guest` | Forwards to upstream `/auth/guest` (no body). Sets `at` + `rt` cookies, returns the same user shape. Used by `withAuthOrGuest` / `ensureGuest` for unauthenticated catalog browsing. |
| `POST /api/auth/logout` | Clear `at` + `rt`; optionally call upstream revoke. |
| `POST /api/auth/refresh` | Read `rt`, forward to upstream refresh, rotate both cookies. Used internally by the proxy on 401. |
| `GET /api/auth/me` | Read `at`, return user shape. Used by `AuthContext` on app start. |
| `POST /api/auth/forgot-password`, `reset-password`, `verify-email` | Stateless forwards; no cookie writes. |

### 7.4 Generic proxy (`app/api/[...path]/route.ts`)

- Catches every non-auth call (`/api/courses/123`, `/api/lessons/456`, etc.).
- Reads `at` cookie; attaches `Authorization: Bearer <at>` to the upstream request at `${ALPHA_API_URL}/<...path>`.
- Forwards method, query, body, and `Content-Type` unchanged. Does **not** forward client cookies upstream — auth is set explicitly via the `Authorization` header. Strips hop-by-hop headers (`Host`, `Connection`, etc.).
- On upstream `401`: tries `/api/auth/refresh` once and retries the original request. If refresh also fails → clears cookies, returns `401` to the client (client redirects to `/login`).
- Streams the response body back unchanged.

### 7.5 Client API layer (`lib/api/index.ts`)

- Same exported function names as `services/api.ts` (`loginUser`, `getCourses`, `getLessonDetail`, etc.) so screens port 1:1.
- Internals change: base URL becomes `''` (relative `/api/...`), no token argument needed, `credentials: 'include'` on every fetch.
- `ApiError` class kept identical so existing error-handling code stays the same.

### 7.6 AuthContext deltas vs alpha-fe

- On mount: `GET /api/auth/me` instead of reading SecureStore. 200 → user, 401 → null.
- `login()` / `register()` / `logout()` call the corresponding `/api/auth/*` route, then set context state from the response.
- `accessToken` field removed from context (not needed in JS).
- `withAuth`, `withAuthOrGuest`, `callMaybeAuthed`, `ensureGuest` are kept (consumers depend on them) but their signatures simplify: the callback is `() => Promise<T>` instead of `(token: string) => Promise<T>`. Consumers change from `withAuth(t => api.foo.bar(x, t))` to `withAuth(() => api.foo.bar(x))` — mechanical port. `ensureGuest()` keeps returning a string (use a sentinel like `'cookie'` since callers ignore the value when not passing it to API calls) — or change return type to `Promise<void>` and update the two callers. The plan prefers the latter (cleaner).
- Consumers that read `user`, `isLoading`, `login`, `logout` are unchanged.

### 7.7 Backend env

- `ALPHA_API_URL` (default `https://api.beprime.pro/api/v1`) — read by `lib/api/server.ts` only. No hardcoded URL in app code.

## 8. Design system port

### 8.1 Tokens

- Port `palette.ts`, `theme.ts`, `shadows.ts`, `speakers.ts`, `timezones.ts` verbatim as TS modules.
- Generate CSS variables in `globals.css`: `--color-bg`, `--color-text`, `--color-primary`, `--shadow-card`, etc.
- Light and dark variable sets live under `[data-theme="light"]` and `[data-theme="dark"]`.
- TS modules remain the source of truth for non-CSS use (chart fills, dynamic styling); CSS variables cover the 95% case.

### 8.2 `StyleSheet` → CSS Modules translation rules

- One `Foo.module.css` per component, colocated with `Foo.tsx`.
- `View` → `<div>`; `Text` → `<span>` or `<p>` per semantics; `Pressable`/`TouchableOpacity` → `<button type="button">`; `ScrollView` → `<div>` with `overflow: auto`; `FlatList` → `.map()` (lists are small; revisit if any list shows perf issues).
- `Image` → `next/image` with explicit `width`/`height`. Sprites stay as CSS `background-image` + `background-position` (matches current sprite usage).
- Style-name mapping handled once in a small helper: `paddingHorizontal` → `padding-inline`, `marginVertical` → `margin-block`, `gap` → `gap`, `rgba()` unchanged, `elevation` → mapped via `--shadow-*` tokens.

### 8.3 Component port order

1. `icons/*` — 23 SVG icons. Pure, no deps. First.
2. `ui/*` — BulletItem, ProgressDots, SkillBadge, TagBadge, HighlightBlock, NoteBlock, DosDonts, ChatWindow, collapsible.
3. `bp/*` — 20 brand components (BPCard, BPTabBar, BPPageHeader, BPProgressBar, BPHeroAvatar, BPStreakCard, BPLessonNode, BPRoadmapNode, etc.).
4. `lesson/*` — LessonCard, LessonHeader, LessonStreak, ModuleSkills, `cardReadiness.ts`, `icons/LessonGlyphs.tsx`, then `steps/*` (15) and `tests/*` (7).
5. Misc: `parallax-scroll-view`, `hello-wave`, `themed-text`, `themed-view`, `haptic-tab` (becomes plain button), `external-link`.

### 8.4 Animations

Framer Motion covers:

- `parallax-scroll-view` → `useScroll` + `useTransform`.
- `hello-wave` → keyframe rotation (can also be pure CSS).
- `ChatWindow` → staggered message reveal (`AnimatePresence` + `motion.div`).
- `TestQuickFire` → countdown bar + answer-feedback flash.
- `TestSwipe` → `motion.div` with `drag="x"` + `dragConstraints`.
- `StepSpeaker` sprite animation → CSS `background-position` keyframes (no JS).

Reduced motion respected via `prefers-reduced-motion`.

### 8.5 Assets

- Copy `alpha-fe/assets/images/*` → `alpha-web-fe/public/images/*` (PNG icons, sprites, favicon, splash icon).
- `alpha-fe/assets/images/icon.png` → also produce `app/icon.png` + `app/apple-icon.png` for Next's metadata API.
- Favicon → `public/favicon.ico` converted from `favicon.png`.
- Sprite usage unchanged: same files, CSS `background-image: url("/images/spritesheet.webp")`.

### 8.6 Theme switching

- `ThemeContext` reads `localStorage.theme` (`'light' | 'dark' | 'system'`). On `'system'` follows `prefers-color-scheme`.
- A small inline `<script>` in `<head>` sets `data-theme` on `<html>` before first paint (no-FOUC pattern).

### 8.7 Native-only feature replacements

| alpha-fe | alpha-web-fe |
|---|---|
| `expo-haptics` | drop; `haptic-tab` becomes plain `<button>` |
| `expo-image` | `next/image` |
| `expo-secure-store` | httpOnly cookies |
| `expo-splash-screen` | `app/loading.tsx` |
| `expo-linear-gradient` | CSS `linear-gradient()` |
| `react-native-svg` | native `<svg>` |
| `react-native-safe-area-context` | `env(safe-area-inset-*)` |
| `expo-updates` | dropped |
| `expo-web-browser` | `<a target="_blank" rel="noopener">` |
| `expo-linking` | `next/navigation` + `next/link` |
| `@react-navigation/*` | App Router + custom `BPTabBar` |

## 9. Implementation sequence

1. **Scaffold.** `npx create-next-app@latest` with TS + App Router + ESLint; strip the demo. Set up paths, tokens, fonts, AppFrame, theme switcher, globals.css.
2. **Proxy + auth backbone.** `/api/auth/*`, `/api/[...path]/route.ts`, `lib/api/server.ts`, `lib/api/index.ts`, `middleware.ts`, `AuthContext`.
3. **Auth screens.** login, register, forgot-password, reset-password, verify-email. End-to-end testable against the real backend.
4. **Design system primitives.** icons → ui → bp.
5. **Tabs shell + home.** `(tabs)/layout.tsx` with `BPTabBar`, then `(tabs)/page.tsx`.
6. **Modules + Profile tabs.**
7. **Course + Module detail screens.**
8. **Settings, Streak, Roadmap, Select-speaker, Select-timezone, Modal.**
9. **Lesson runner.** LessonCard, LessonHeader, LessonStreak, ModuleSkills, all 15 `steps/*`, all 7 `tests/*`.
10. **Polish.** Dark theme audit, animation tuning, safe-area review, favicon/icon metadata, README.

The work is one cohesive plan — single Next app, one API contract, one design system. No need to decompose into sub-projects.

## 10. Risks

- **Gesture-heavy test components.** `react-native-gesture-handler` interactions in `lesson/tests/*` will be approximated with Framer Motion `drag`. Functionally equivalent, but tactile feel will differ. Brief design check after each test type lands.
- **Parallax timing.** `parallax-scroll-view` uses `Animated.event`; web uses `useScroll`. Different timing curve; will need a one-pass tweak to match.
- **API URL hardcode.** `alpha-fe/services/api.ts` hardcodes `https://api.beprime.pro/api/v1`. We make it env-driven (`ALPHA_API_URL`) and document the default in the README.
- **Lesson runner scope.** 22 step/test components is the single largest chunk of work. Mitigated by tackling it last, when the design system and frame are stable.
