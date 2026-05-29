# PC Lesson Page + Module Page Desktop Fix — Design

Date: 2026-05-29

## Goal

Give the lesson page a proper desktop (PC) layout, and fix the module detail page's
appearance on screens wider than the mobile breakpoint. Today the lesson page only has a
mobile (single-card reader) layout regardless of viewport, and the module detail page has a
broken intermediate layout between 768px and 1024px.

Two independent parts; the mobile experience must remain unchanged for both.

## Decisions (confirmed)

- New lessons-list endpoint is **lessonId-based** so the sidebar can load in parallel with
  the lesson-info fetch (the page only knows the lessonId).
- Lesson sidebar layout appears at **≥1024px**. Below that, the current mobile reader is unchanged.
- The lesson page **shows the global PC header (`BPAppBar`)** on desktop (≥1024px).
- "Full width" for the module page means **match the PC header width** (`--w-tabs` = 1040px,
  centered), mirroring how the `/modules` tab page is laid out.

---

## Part 1 — Module detail page desktop fix (≥768px)

### Problem

The module detail page's desktop layout (1040px width, sticky about/lessons sidebar, hidden
back button) currently activates only at **≥1024px**. The global PC header (`BPAppBar`) appears
at **≥768px**. So between 768–1024px the page shows:

- a redundant back-button header (`BPPageHeader`) **in addition to** the PC header, and
- a narrow 600px (`--w-detail`) content column that is misaligned with the 1040px header.

### Fix

Lower the desktop breakpoint from 1024px → 768px so the module detail aligns with the PC
header exactly where the header appears. No markup/element changes — CSS only.

- `app/module/[id]/_components/ModuleShell.module.css`: collapse the two media queries
  (768px → 600px `--w-detail`; 1024px → 1040px `--w-tabs` grid + sticky sidebar) into a single
  `@media (min-width: 768px)` that applies the grid (`grid-template-columns: 220px 1fr`),
  `max-width: var(--w-tabs)`, gap, and the sticky about/lessons `.sidebar` from 768px up.
- `app/module/[id]/page.module.css`: change the `@media (min-width: 1024px)` block to
  `@media (min-width: 768px)`. That block already hides `.pageHeader` (back button) and
  `.tabWrap` (mobile tab pills), adjusts `.titleBlock` / `.aboutContent` paddings, hides
  `.sectionTitle`, and grids `.statementsOutcomes`.

### Result

From 768px up: no back button (PC header only), full 1040px width matching the header,
about/lessons in the left sidebar. Elements unchanged — just no back button and full width.
Below 768px: unchanged mobile layout.

---

## Part 2 — Lesson page PC version (≥1024px)

### Backend (Alpha.Server)

New lessonId-based list endpoint so the sidebar can load in parallel with lesson-info.

- **Controller:** `LessonController` gains `POST get-list` (route `api/v1/lessons/get-list`),
  `[AllowAnonymous]`, using the existing `TryGetUserId()` helper. Request `{ id }` (= lessonId).
  Returns `NotFound()` if the lesson is missing/disabled.
- **Service:** `ILessonService.GetLessonListByLessonAsync(int lessonId, int? userId, CancellationToken)`.
  - Load the lesson by id; if null or `Status != Enabled` → return null (→ 404).
  - From the lesson's `ModuleId`, load enabled lessons (`_lessonRepository.GetEnabledByModuleIdAsync`),
    the user's progress for those lessons (`_progressRepository.GetByUserAndLessonIdsAsync`), and the
    owned flag (`_accessRepository.HasAccessAsync`). Also load the module to get its title.
  - Compute each lesson summary exactly as `ModuleService.GetModuleInfoAsync` does:
    `progressStatus` from progress (default `"NotStarted"`), `isLocked = !isFreePreview && !owned`.
  - `LessonService` already has all four repositories (`_lessonRepository`, `_progressRepository`,
    `_moduleRepository`, `_accessRepository`) injected, so this is self-contained — no new
    dependencies, no shared extraction required.
- **DTOs (Alpha.Server.Models):**
  - `Requests/Lesson/V1LessonGetListRequest` — `{ int Id }`.
  - `Responses/Lesson/V1LessonGetListResponse` — `{ int ModuleId, string ModuleTitle, LessonModel[] Lessons }`,
    where `LessonModel` mirrors `V1ModuleInfoResponse.LessonModel`
    (`Id, ModuleId, Title, Description, Status, SortOrder, ProgressStatus, IsFreePreview, IsLocked`).
  - A corresponding BLL DTO for the service return (e.g. `LessonListDto`) holding module id/title +
    lesson summaries (reuse `LessonDto` for the rows where it fits).
- **Tests:** one service-level test mirroring existing patterns (`LessonAccessTests`,
  `ModuleService_AnonymousTests`): verifies lock/status for owned vs. not-owned and anonymous,
  and that a free-preview lesson is unlocked.

### Frontend (alpha-web-fe)

- **Types** (`types/api.ts`): add
  `ApiLessonListResponse { moduleId: number; moduleTitle: string; lessons: ApiLesson[] }`
  (reuses the existing `ApiLesson` type, whose fields already match the response).
- **API** (`lib/api/index.ts`): add
  `lessons.getList: (lessonId: number) => post<ApiLessonListResponse>('/api/lessons/get-list', { id: lessonId })`.
  The proxy forwards `/api/lessons/get-list` → upstream `/api/v1/lessons/get-list`.
- **Page** (`app/lesson/[id]/page.tsx`):
  - On mount, fire `api.lessons.getInfo(lessonId)` and `api.lessons.getList(lessonId)` in parallel as
    two independent requests (not awaited together). Lesson content renders as soon as `getInfo`
    resolves; the sidebar renders when `getList` resolves. Each has its own loading state; a `getList`
    failure degrades gracefully (sidebar simply absent) and never blocks the lesson.
  - Add separate state for the lessons list (`lessonList`, `lessonListLoading`). The existing
    card-flow state and handlers are untouched.
- **Component** `app/lesson/[id]/_components/LessonSidebar.tsx` (+ `.module.css`):
  - Renders the lessons list (sorted by `sortOrder`) with done / active / locked states and a lock
    icon, matching the visual idiom of `LessonsTab` / `BPLessonNode` in a compact sidebar form.
  - Highlights the current lesson (by `lessonId`).
  - Clicking a lesson navigates `router.push('/lesson/{id}')`; locked lessons are blocked with the same
    UX as `LessonsTab` (alert / no-op). Current lesson is a no-op.
- **Layout / CSS** (`app/lesson/[id]/page.module.css` + new sidebar CSS):
  - **<1024px:** unchanged. Full-screen mobile reader; no `BPAppBar`; existing `LessonHeader` and
    `PageContainer variant="reader"` behavior preserved.
  - **≥1024px:** render `BPAppBar` at the top, wrapped so it is desktop-only (shown only at ≥1024px)
    to avoid colliding with the reader's own `LessonHeader` in the 768–1024px range. Below the header,
    a centered `--w-tabs` (1040px) grid: left sidebar (~280px) + content column (`1fr`). The card
    navigation (Далее/Назад, swipe, keyboard) is untouched; cards keep a comfortable reading width
    inside the content column (the content column constrains card width rather than letting cards
    stretch full-width).

### Scope

Backend (`Alpha.Server`) + frontend (`alpha-web-fe`), two separate git repos. The mobile experience
is unchanged for both parts.

## Out of scope

- No redesign of card content or the card-flow interaction model.
- No changes to progress saving, buying, or access logic beyond the new read-only list endpoint.
- No changes to the module page below 768px.
