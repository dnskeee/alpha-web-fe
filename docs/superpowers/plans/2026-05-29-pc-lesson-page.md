# PC Lesson Page + Module Page Desktop Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a desktop (≥1024px) layout to the lesson page — a left sidebar listing the module's lessons (loaded in parallel via a new lessonId-based endpoint) with the lesson content filling the rest — and fix the module detail page so that from ≥768px it drops the redundant back button and matches the PC header width.

**Architecture:** A new read-only backend endpoint `POST /api/v1/lessons/get-list` takes a lessonId and returns the sibling lessons with lock/progress status, reusing `LessonService`'s already-injected repositories. The frontend fetches lesson-info and lesson-list independently in parallel; below 1024px the existing mobile reader is untouched, and at ≥1024px a CSS grid adds the sidebar and the global `BPAppBar`. The module page fix is CSS-only: lower its desktop breakpoint from 1024px to 768px.

**Tech Stack:** Backend — C# / ASP.NET Core, EF Core, xUnit. Frontend — Next.js (App Router), React, TypeScript, CSS Modules.

**Repo paths (two separate git repos):**
- Backend: `/Users/dinar.faiskhanov/Projects/alpha/Alpha.Server`
- Frontend: `/Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe`

**Note on testing:** The backend has an xUnit suite (`Alpha.Server.Tests`) — use TDD there. The frontend has **no** test harness, so frontend tasks verify with `npx tsc --noEmit`, `npm run lint`, and a manual browser check. Do not scaffold a new FE test framework.

---

## File Structure

**Backend (`Alpha.Server/Alpha.Server`)**
- Modify `BLL/Models/LessonDto.cs` — add `LessonListDto`.
- Modify `BLL/Interfaces/ILessonService.cs` — add `GetLessonListByLessonAsync`.
- Modify `BLL/Services/LessonService.cs` — implement `GetLessonListByLessonAsync`.
- Create `Alpha.Server.Models/Dto/Requests/Lesson/V1LessonGetListRequest.cs`.
- Create `Alpha.Server.Models/Dto/Responses/Lesson/V1LessonGetListResponse.cs`.
- Modify `Controllers/LessonController.cs` — add `get-list` action.
- Create `Alpha.Server.Tests/BLL/LessonService_GetListTests.cs`.

**Frontend (`alpha-web-fe`)**
- Modify `types/api.ts` — add `ApiLessonListResponse`.
- Modify `lib/api/index.ts` — add `lessons.getList`.
- Create `app/lesson/[id]/_components/LessonSidebar.tsx` + `.module.css`.
- Modify `app/lesson/[id]/page.tsx` — parallel fetch + desktop layout.
- Modify `app/lesson/[id]/page.module.css` — desktop grid + app-bar wrap.
- Modify `app/module/[id]/_components/ModuleShell.module.css` — breakpoint 1024 → 768.
- Modify `app/module/[id]/page.module.css` — breakpoint 1024 → 768.

---

## Part A — Backend: lessons/get-list endpoint

### Task 1: BLL DTO + service interface + failing service test

**Files:**
- Modify: `Alpha.Server/Alpha.Server/BLL/Models/LessonDto.cs`
- Modify: `Alpha.Server/Alpha.Server/BLL/Interfaces/ILessonService.cs`
- Test: `Alpha.Server/Alpha.Server.Tests/BLL/LessonService_GetListTests.cs`

- [ ] **Step 1: Add `LessonListDto` to `BLL/Models/LessonDto.cs`**

Append this class to the end of the file (after `LessonProgressDto`):

```csharp
public class LessonListDto
{
    public int ModuleId { get; set; }
    public required string ModuleTitle { get; set; }
    public required LessonDto[] Lessons { get; set; }
}
```

- [ ] **Step 2: Declare the method in `BLL/Interfaces/ILessonService.cs`**

Add this line inside the `ILessonService` interface, after the `GetLessonInfoAsync` line:

```csharp
    Task<LessonListDto?> GetLessonListByLessonAsync(int lessonId, int? userId, CancellationToken cancellationToken = default);
```

- [ ] **Step 3: Write the failing test**

Create `Alpha.Server/Alpha.Server.Tests/BLL/LessonService_GetListTests.cs`:

```csharp
using Alpha.Server.BLL.Services;
using Alpha.Server.DAL.Models;
using Alpha.Server.DAL.Repositories;
using Alpha.Server.Tests.Helpers;

namespace Alpha.Server.Tests.BLL;

public class LessonService_GetListTests
{
    private static LessonService MakeService(AlphaDbContext ctx) =>
        new(new LessonRepository(ctx),
            new UserLessonProgressRepository(ctx),
            new ModuleRepository(ctx),
            new UserModuleAccessRepository(ctx));

    [Fact]
    public async Task GetList_AnonymousUser_ReturnsSiblingsWithLockAndModuleTitle()
    {
        using var db = TestDb.Create();
        db.Ctx.Modules.Add(new ModuleEntity { Id = 1, CourseId = 1, Title = "My Module", Status = ContentStatus.Enabled });
        db.Ctx.Lessons.Add(new LessonEntity { Id = 1, ModuleId = 1, Title = "Free", SortOrder = 1, IsFreePreview = true, Status = ContentStatus.Enabled });
        db.Ctx.Lessons.Add(new LessonEntity { Id = 2, ModuleId = 1, Title = "Paid", SortOrder = 2, IsFreePreview = false, Status = ContentStatus.Enabled });
        await db.Ctx.SaveChangesAsync();

        var svc = MakeService(db.Ctx);
        var result = await svc.GetLessonListByLessonAsync(lessonId: 1, userId: null, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(1, result!.ModuleId);
        Assert.Equal("My Module", result.ModuleTitle);
        Assert.Equal(2, result.Lessons.Length);
        Assert.False(result.Lessons.Single(l => l.Id == 1).IsLocked);
        Assert.True(result.Lessons.Single(l => l.Id == 2).IsLocked);
        Assert.All(result.Lessons, l => Assert.Equal("NotStarted", l.ProgressStatus));
    }

    [Fact]
    public async Task GetList_MissingLesson_ReturnsNull()
    {
        using var db = TestDb.Create();
        var svc = MakeService(db.Ctx);

        var result = await svc.GetLessonListByLessonAsync(lessonId: 999, userId: null, CancellationToken.None);

        Assert.Null(result);
    }
}
```

- [ ] **Step 4: Run the test to verify it fails to compile / fails**

Run: `dotnet test /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server/Alpha.Server.Tests/Alpha.Server.Tests.csproj --filter FullyQualifiedName~LessonService_GetListTests`
Expected: BUILD FAILURE — `GetLessonListByLessonAsync` has no implementation (interface declared, not implemented in `LessonService`). This confirms the test targets the new method.

- [ ] **Step 5: Commit (backend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server add Alpha.Server/BLL/Models/LessonDto.cs Alpha.Server/BLL/Interfaces/ILessonService.cs Alpha.Server.Tests/BLL/LessonService_GetListTests.cs
git -C /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server commit -m "test(lesson): failing test for GetLessonListByLessonAsync"
```

(If on the default branch, first run `git -C /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server checkout -b feature/pc-lesson-page`.)

---

### Task 2: Implement `GetLessonListByLessonAsync`

**Files:**
- Modify: `Alpha.Server/Alpha.Server/BLL/Services/LessonService.cs`

- [ ] **Step 1: Add the implementation**

Add this method to `LessonService` (e.g. directly after `GetLessonInfoAsync`). It reuses the four repositories already injected into the constructor (`_lessonRepository`, `_progressRepository`, `_moduleRepository`, `_accessRepository`) and mirrors the lock/status logic in `ModuleService.GetModuleInfoAsync`:

```csharp
    public async Task<LessonListDto?> GetLessonListByLessonAsync(int lessonId, int? userId, CancellationToken cancellationToken = default)
    {
        var lesson = await _lessonRepository.GetByIdAsync(lessonId, cancellationToken);
        if (lesson == null || lesson.Status != ContentStatus.Enabled) return null;

        var module = await _moduleRepository.GetByIdAsync(lesson.ModuleId, cancellationToken);
        if (module == null) return null;

        var lessons = await _lessonRepository.GetEnabledByModuleIdAsync(lesson.ModuleId, cancellationToken);
        var lessonIds = lessons.Select(l => l.Id).ToList();

        var progresses = userId.HasValue
            ? await _progressRepository.GetByUserAndLessonIdsAsync(userId.Value, lessonIds, cancellationToken)
            : [];
        var progressByLessonId = progresses.ToDictionary(p => p.LessonId);

        var owned = userId.HasValue
            && await _accessRepository.HasAccessAsync(userId.Value, lesson.ModuleId, cancellationToken);

        var lessonDtos = lessons.Select(l => new LessonDto
        {
            Id = l.Id,
            ModuleId = l.ModuleId,
            Title = l.Title,
            Description = l.Description,
            Status = l.Status.ToString(),
            SortOrder = l.SortOrder,
            ProgressStatus = progressByLessonId.TryGetValue(l.Id, out var progress)
                ? progress.Status.ToString()
                : "NotStarted",
            IsFreePreview = l.IsFreePreview,
            IsLocked = !l.IsFreePreview && !owned
        }).ToArray();

        return new LessonListDto
        {
            ModuleId = module.Id,
            ModuleTitle = module.Title,
            Lessons = lessonDtos
        };
    }
```

- [ ] **Step 2: Run the test to verify it passes**

Run: `dotnet test /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server/Alpha.Server.Tests/Alpha.Server.Tests.csproj --filter FullyQualifiedName~LessonService_GetListTests`
Expected: PASS — both tests green.

- [ ] **Step 3: Commit (backend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server add Alpha.Server/BLL/Services/LessonService.cs
git -C /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server commit -m "feat(lesson): GetLessonListByLessonAsync returns siblings with lock/status"
```

---

### Task 3: Request/Response DTOs + controller endpoint

**Files:**
- Create: `Alpha.Server/Alpha.Server.Models/Dto/Requests/Lesson/V1LessonGetListRequest.cs`
- Create: `Alpha.Server/Alpha.Server.Models/Dto/Responses/Lesson/V1LessonGetListResponse.cs`
- Modify: `Alpha.Server/Alpha.Server/Controllers/LessonController.cs`

- [ ] **Step 1: Create the request DTO**

Create `Alpha.Server/Alpha.Server.Models/Dto/Requests/Lesson/V1LessonGetListRequest.cs`:

```csharp
namespace Alpha.Server.Models.Dto.Requests.Lesson;

public class V1LessonGetListRequest
{
    public int Id { get; init; }
}
```

- [ ] **Step 2: Create the response DTO**

Create `Alpha.Server/Alpha.Server.Models/Dto/Responses/Lesson/V1LessonGetListResponse.cs` (the `LessonModel` mirrors `V1ModuleInfoResponse.LessonModel`):

```csharp
namespace Alpha.Server.Models.Dto.Responses.Lesson;

public class V1LessonGetListResponse
{
    public int ModuleId { get; init; }
    public required string ModuleTitle { get; init; }
    public required LessonModel[] Lessons { get; init; }

    public class LessonModel
    {
        public int Id { get; init; }
        public int ModuleId { get; init; }
        public required string Title { get; init; }
        public string? Description { get; init; }
        public required string Status { get; init; }
        public int SortOrder { get; init; }
        public required string ProgressStatus { get; init; }
        public bool IsFreePreview { get; init; }
        public bool IsLocked { get; init; }
    }
}
```

- [ ] **Step 3: Add the controller action**

In `Alpha.Server/Alpha.Server/Controllers/LessonController.cs`, add this action inside the `LessonController` class (after `GetInfo`). It follows the same `TryGetUserId()` / `[AllowAnonymous]` pattern:

```csharp
    [HttpPost("get-list")]
    [AllowAnonymous]
    public async Task<ActionResult<V1LessonGetListResponse>> GetList(
        [FromBody] V1LessonGetListRequest request,
        CancellationToken cancellationToken)
    {
        var userId = TryGetUserId();
        var result = await _lessonService.GetLessonListByLessonAsync(request.Id, userId, cancellationToken);
        if (result == null) return NotFound();

        return Ok(new V1LessonGetListResponse
        {
            ModuleId = result.ModuleId,
            ModuleTitle = result.ModuleTitle,
            Lessons = result.Lessons.Select(l => new V1LessonGetListResponse.LessonModel
            {
                Id = l.Id,
                ModuleId = l.ModuleId,
                Title = l.Title,
                Description = l.Description,
                Status = l.Status,
                SortOrder = l.SortOrder,
                ProgressStatus = l.ProgressStatus,
                IsFreePreview = l.IsFreePreview,
                IsLocked = l.IsLocked
            }).ToArray()
        });
    }
```

The file already has `using Alpha.Server.Models.Dto.Requests.Lesson;` and `using Alpha.Server.Models.Dto.Responses.Lesson;`, so no new usings are needed.

- [ ] **Step 4: Build and run the full backend test suite**

Run: `dotnet test /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server/Alpha.Server.Tests/Alpha.Server.Tests.csproj`
Expected: PASS — the solution builds (controller compiles against the new DTOs) and all tests are green.

- [ ] **Step 5: Commit (backend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server add Alpha.Server.Models/Dto/Requests/Lesson/V1LessonGetListRequest.cs Alpha.Server.Models/Dto/Responses/Lesson/V1LessonGetListResponse.cs Alpha.Server/Controllers/LessonController.cs
git -C /Users/dinar.faiskhanov/Projects/alpha/Alpha.Server commit -m "feat(lesson): POST get-list endpoint for sibling lessons"
```

---

## Part B — Frontend: module page desktop fix (CSS only)

### Task 4: ModuleShell breakpoint 1024 → 768

**Files:**
- Modify: `alpha-web-fe/app/module/[id]/_components/ModuleShell.module.css`

- [ ] **Step 1: Replace the two media queries with a single 768px query**

Replace the existing `@media (min-width: 768px)` and `@media (min-width: 1024px)` blocks for `.wrap` (the first two media blocks in the file) with this single block. The grid + full width + sticky sidebar now begin at 768px:

```css
@media (min-width: 768px) {
  .wrap {
    padding-top: 32px;
    padding-left: clamp(16px, 4vw, 32px);
    padding-right: clamp(16px, 4vw, 32px);
    max-width: var(--w-tabs);
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 32px;
  }
}
```

Then change the `.sidebar` reveal query from `@media (min-width: 1024px)` to `@media (min-width: 768px)`:

```css
@media (min-width: 768px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: sticky;
    top: 96px;
    align-self: start;
  }
}
```

Leave `.wrap { width: 100% }`, `.sidebar { display: none }`, `.link`, `.linkActive`, and `.main` unchanged.

- [ ] **Step 2: Typecheck**

Run: `cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe && npx tsc --noEmit`
Expected: no errors (CSS-only change; this just confirms nothing else broke).

- [ ] **Step 3: Commit (frontend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/module/[id]/_components/ModuleShell.module.css
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "fix(module): apply desktop sidebar/full-width layout from 768px"
```

---

### Task 5: module page.module.css breakpoint 1024 → 768

**Files:**
- Modify: `alpha-web-fe/app/module/[id]/page.module.css`

- [ ] **Step 1: Change the desktop media query breakpoint**

In `app/module/[id]/page.module.css`, change the line `@media (min-width: 1024px) {` (the only such query, near the end of the file, containing `.pageHeader { display: none; }`, `.tabWrap { display: none; }`, etc.) to:

```css
@media (min-width: 768px) {
```

Leave the contents of the block unchanged.

- [ ] **Step 2: Typecheck**

Run: `cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification**

Run the dev server (`cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe && npm run dev`), open a module page (`/module/<id>`), and resize the window between 768px and 1024px. Confirm: only the PC header shows (no back-button header), the about/lessons sidebar is present, and the content spans the full 1040px width aligned with the header. Below 768px the mobile layout is unchanged.

- [ ] **Step 4: Commit (frontend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/module/[id]/page.module.css
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "fix(module): hide back button and grid content from 768px"
```

---

## Part C — Frontend: PC lesson page (≥1024px)

### Task 6: Types + API method

**Files:**
- Modify: `alpha-web-fe/types/api.ts`
- Modify: `alpha-web-fe/lib/api/index.ts`

- [ ] **Step 1: Add the response type**

In `types/api.ts`, add this interface immediately after the `ApiLessonDetail` interface (it reuses the existing `ApiLesson` type, whose fields match the response):

```typescript
export interface ApiLessonListResponse {
  moduleId: number;
  moduleTitle: string;
  lessons: ApiLesson[];
}
```

- [ ] **Step 2: Add the API method**

In `lib/api/index.ts`, add `ApiLessonListResponse` to the import from `@/types/api`, and extend the `lessons` object:

```typescript
  lessons: {
    getInfo: (id: number) => post<ApiLessonDetail>('/api/lessons/get-info', { id }),
    getList: (lessonId: number) => post<ApiLessonListResponse>('/api/lessons/get-list', { id: lessonId }),
  },
```

- [ ] **Step 3: Typecheck**

Run: `cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit (frontend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add types/api.ts lib/api/index.ts
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "feat(lesson): add lessons.getList API + ApiLessonListResponse type"
```

---

### Task 7: LessonSidebar component

**Files:**
- Create: `alpha-web-fe/app/lesson/[id]/_components/LessonSidebar.tsx`
- Create: `alpha-web-fe/app/lesson/[id]/_components/LessonSidebar.module.css`

- [ ] **Step 1: Create `LessonSidebar.tsx`**

Create `app/lesson/[id]/_components/LessonSidebar.tsx`. It sorts lessons by `sortOrder`, marks the current lesson, shows done/active/locked state, and navigates on click (locked → blocked, current → no-op), mirroring the navigation rules in `app/module/[id]/_components/LessonsTab.tsx`:

```tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { CheckIcon } from '@/components/icons/CheckIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { PlayIcon } from '@/components/icons/PlayIcon';
import { ApiLesson } from '@/types/api';
import s from './LessonSidebar.module.css';

interface LessonSidebarProps {
  lessons: ApiLesson[];
  currentLessonId: number;
  moduleTitle: string;
  loading: boolean;
}

export function LessonSidebar({ lessons, currentLessonId, moduleTitle, loading }: LessonSidebarProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className={s.sidebar}>
        <div className={s.spinner} />
      </div>
    );
  }

  const sorted = [...lessons].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleClick = (lesson: ApiLesson) => {
    if (lesson.id === currentLessonId) return;
    if (lesson.isLocked) return;
    router.push(`/lesson/${lesson.id}`);
  };

  return (
    <div className={s.sidebar}>
      {moduleTitle && <p className={s.moduleTitle}>{moduleTitle}</p>}
      <div className={s.list}>
        {sorted.map((lesson, index) => {
          const isCurrent = lesson.id === currentLessonId;
          const isDone = lesson.progressStatus === 'Done';
          const isLocked = lesson.isLocked;
          const rowClass = [
            s.row,
            isCurrent ? s.rowCurrent : '',
            isLocked && !isCurrent ? s.rowLocked : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={lesson.id}
              type="button"
              className={rowClass}
              onClick={() => handleClick(lesson)}
              aria-current={isCurrent ? 'page' : undefined}
              disabled={isLocked && !isCurrent}
            >
              <span className={s.badge}>
                {isLocked ? (
                  <LockIcon size={12} color="var(--color-muted)" />
                ) : isDone ? (
                  <CheckIcon size={13} color="var(--color-accent)" />
                ) : (
                  <PlayIcon size={11} color={isCurrent ? 'var(--color-accent)' : 'var(--color-muted)'} />
                )}
              </span>
              <span className={s.texts}>
                <span className={s.label}>Урок {index + 1}</span>
                <span className={s.title}>{lesson.title}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `LessonSidebar.module.css`**

Create `app/lesson/[id]/_components/LessonSidebar.module.css`:

```css
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 4px;
  height: 100%;
  overflow-y: auto;
}

.moduleTitle {
  font-weight: 800;
  font-size: 14px;
  color: var(--color-ink);
  letter-spacing: -0.3px;
  margin: 0 0 4px;
  padding: 0 8px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 12px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s;
}

.row:hover {
  background: var(--color-card-soft);
}

.rowCurrent {
  background: var(--color-accent-soft);
}

.rowCurrent:hover {
  background: var(--color-accent-soft);
}

.rowLocked {
  cursor: default;
  opacity: 0.6;
}

.rowLocked:hover {
  background: transparent;
}

.badge {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--color-bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.texts {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.label {
  font-weight: 700;
  font-size: 11px;
  color: var(--color-muted);
}

.title {
  font-weight: 600;
  font-size: 13px;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spinner {
  width: 24px;
  height: 24px;
  margin: 16px auto;
  border: 3px solid var(--color-track);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe && npx tsc --noEmit && npm run lint`
Expected: no errors. (The component is not yet imported anywhere; that happens in Task 8.)

- [ ] **Step 4: Commit (frontend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/lesson/[id]/_components/LessonSidebar.tsx app/lesson/[id]/_components/LessonSidebar.module.css
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "feat(lesson): LessonSidebar component for desktop lesson list"
```

---

### Task 8: Lesson page — parallel fetch + desktop layout

**Files:**
- Modify: `alpha-web-fe/app/lesson/[id]/page.tsx`
- Modify: `alpha-web-fe/app/lesson/[id]/page.module.css`

- [ ] **Step 1: Add imports to `page.tsx`**

At the top of `app/lesson/[id]/page.tsx`, add these imports alongside the existing ones:

```tsx
import { BPAppBar } from '@/components/bp/BPAppBar';
import { LessonSidebar } from './_components/LessonSidebar';
import { ApiLesson, ApiLessonListResponse } from '@/types/api';
```

The file already imports `ApiLessonDetail` from `@/types/api` — merge the new symbols into that existing import line instead of duplicating it, i.e.:

```tsx
import { ApiLessonDetail, ApiLesson, ApiLessonListResponse } from '@/types/api';
```

- [ ] **Step 2: Add sidebar state and the parallel fetch**

Inside `LessonScreen`, add this state next to the existing `useState` declarations (after the `completedCards` state):

```tsx
  const [lessonList, setLessonList] = useState<ApiLessonListResponse | null>(null);
```

Then add a second effect (right after the existing `useEffect` that calls `getInfo`) that fetches the list **in parallel** — independent of the info request, failing silently:

```tsx
  useEffect(() => {
    withAuthOrGuest(() => api.lessons.getList(lessonId))
      .then((data) => setLessonList(data))
      .catch(() => setLessonList(null));
  }, [lessonId, withAuthOrGuest]);
```

- [ ] **Step 3: Wrap the rendered output with the desktop shell**

The three `return (...)` blocks (loading, not-found, and main) currently each render `<div className={s.safe}><PageContainer variant="reader">...`. Wrap each one's `<div className={s.safe}>` contents so the desktop app bar and sidebar are added without disturbing the mobile layout.

For the **main** return (the last one), replace:

```tsx
  return (
    <div className={s.safe}>
      <PageContainer variant="reader">
        <div
          className={s.container}
```

with:

```tsx
  return (
    <div className={s.safe}>
      <div className={s.appBarWrap}>
        <BPAppBar />
      </div>
      <div className={s.body}>
        <aside className={s.sidebarWrap}>
          <LessonSidebar
            lessons={lessonList?.lessons ?? []}
            currentLessonId={lessonId}
            moduleTitle={lessonList?.moduleTitle ?? ''}
            loading={lessonList === null}
          />
        </aside>
        <div className={s.readerCol}>
          <PageContainer variant="reader">
            <div
              className={s.container}
```

and add the matching closing tags. The existing main block ends with:

```tsx
        </div>
      </PageContainer>
    </div>
  );
```

Change that closing to:

```tsx
            </div>
          </PageContainer>
        </div>
      </div>
    </div>
  );
```

(The added wrappers are `.body` and `.readerCol`, so two extra closing `</div>` are needed before the final `</div>` that closes `.safe`. Re-indent as needed; indentation is cosmetic.)

For the **loading** and **not-found** returns, leave them as-is — they already render the `.safe` + `PageContainer` reader and look correct mobile and desktop without the sidebar. (The sidebar only matters once the lesson renders.)

- [ ] **Step 4: Add desktop layout CSS**

In `app/lesson/[id]/page.module.css`, append the following at the end of the file. On mobile, `.appBarWrap`/`.sidebarWrap` are hidden and `.body`/`.readerCol` use `display: contents` so the existing reader renders exactly as before. At ≥1024px a grid appears with a fixed-height body under the app bar:

```css
.appBarWrap {
  display: none;
}

.body {
  display: contents;
}

.readerCol {
  display: contents;
}

.sidebarWrap {
  display: none;
}

@media (min-width: 1024px) {
  .appBarWrap {
    display: block;
  }

  .body {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    max-width: var(--w-tabs);
    margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 32px);
    height: calc(100dvh - 57px);
  }

  .sidebarWrap {
    display: block;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    padding-top: 16px;
  }

  .readerCol {
    display: block;
    position: relative;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .container {
    min-height: 0;
    height: 100%;
  }
}
```

Note: the existing `.safe { min-height: 100dvh }` stays. The `57px` matches the `BPAppBar` height (14px padding top + bottom + 28px logo ≈ 56–57px); the sticky app bar sits above the fixed-height grid so the page does not double-scroll.

- [ ] **Step 5: Typecheck and lint**

Run: `cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe && npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 6: Build**

Run: `cd /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe && npm run build`
Expected: build succeeds.

- [ ] **Step 7: Manual verification**

With the backend running and `npm run dev`, open a lesson (`/lesson/<id>`):
- **Desktop (≥1024px):** the PC header shows on top; a left sidebar lists the module's lessons with the current one highlighted, done lessons showing a check, locked lessons showing a lock and not clickable; clicking another unlocked lesson navigates to it. The lesson content (cards + nav) fills the rest of the width. The sidebar appears as soon as `get-list` resolves (independent of the card content).
- **Mobile (<1024px):** unchanged — full-screen reader, no PC header, no sidebar.
- In the browser Network tab, confirm `get-info` and `get-list` are issued concurrently (neither waits for the other).

- [ ] **Step 8: Commit (frontend repo)**

```bash
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe add app/lesson/[id]/page.tsx app/lesson/[id]/page.module.css
git -C /Users/dinar.faiskhanov/Projects/alpha/alpha-web-fe commit -m "feat(lesson): desktop sidebar layout with parallel lesson-list fetch"
```

---

## Self-Review

**Spec coverage:**
- Sidebar with lessons list via new API call → Tasks 1–3 (endpoint) + 6 (FE API) + 7 (component) + 8 (wiring). ✓
- New API call fetched in parallel with lesson info → Task 8 Step 2 (two independent effects), verified in Step 7. ✓
- Lesson status / lock in sidebar → Task 7 (done/active/locked + lock icon) backed by Task 2's `isLocked`/`progressStatus`. ✓
- Lesson content takes rest of width → Task 8 Step 4 (`grid-template-columns: 280px 1fr`). ✓
- Global PC header on lesson desktop → Task 8 (`BPAppBar` in `.appBarWrap`, shown ≥1024px). ✓
- Sidebar at ≥1024px, mobile unchanged → Task 8 Step 4 (`display: contents` below 1024px). ✓
- Module page >768px: no back button + full width, elements same → Tasks 4 & 5 (breakpoint 1024 → 768, CSS only). ✓

**Placeholder scan:** No TBD/TODO; every code/CSS step shows full content. ✓

**Type consistency:** `GetLessonListByLessonAsync` signature identical across interface (Task 1), implementation (Task 2), and controller call (Task 3). `LessonListDto { ModuleId, ModuleTitle, Lessons }` matches `V1LessonGetListResponse`. FE `ApiLessonListResponse { moduleId, moduleTitle, lessons }` matches the response DTO's JSON. `lessons.getList(lessonId)` posts `{ id: lessonId }`, matching `V1LessonGetListRequest { Id }`. `LessonSidebar` props match its call site in Task 8. ✓

**Constructor order check:** Test (`MakeService`) passes repositories in `LessonService`'s actual constructor order — `LessonRepository, UserLessonProgressRepository, ModuleRepository, UserModuleAccessRepository`. ✓
