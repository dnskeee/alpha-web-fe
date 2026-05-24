# alpha-web-fe

Web port of the alpha-fe mobile app. Next.js 16 (App Router), React 19, TypeScript.

## Quick start

```bash
cp .env.example .env.local   # edit ALPHA_API_URL if needed
npm install
npm run dev                  # http://localhost:3000
```

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

## Implementation plan

See `docs/superpowers/plans/2026-05-24-alpha-web-fe.md`.
