# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint via eslint.config.mjs
```

No test runner is configured.

## Architecture

**Current state: Next.js API routes + Supabase (PostgreSQL) backend. No auth — login-free.**

### Data flow

```
src/app/page.tsx  ("use client" — owns all state, filters, view toggle)
  ├── fetch /api/tasks          ← GET / POST
  ├── fetch /api/tasks/[id]     ← PATCH / DELETE
  ├── src/types/task.ts         ← Task type, Status, Priority, MEMBERS, display configs
  ├── src/components/KanbanBoard.tsx   \
  ├── src/components/TaskListView.tsx   ├─ receive tasks + callbacks as props
  ├── src/components/TaskCard.tsx      /
  ├── src/components/TaskFormDialog.tsx  ← create / edit modal
  └── src/components/StatsBar.tsx        ← summary counts

src/app/api/tasks/route.ts       ← GET (list), POST (create)
src/app/api/tasks/[id]/route.ts  ← GET, PATCH, DELETE
  └── src/lib/supabase/server.ts ← createServerClient (anon key + cookies)
```

Components are purely presentational — they never call the API directly.

### Supabase schema (`public.tasks`)

| column       | type        | notes                              |
|---|---|---|
| id           | uuid        | PK, default gen_random_uuid()      |
| title        | text        | required                           |
| status       | text        | todo / in_progress / review / done |
| priority     | text        | urgent / high / medium / low       |
| assignee_id  | text        | member name string, nullable       |
| created_at   | timestamptz | default now()                      |

RLS is enabled. Policy `allow_all_anon` permits all operations for the `anon` role.

Project ID: `jshhhjnoblhdcpprdmav` (region: ap-northeast-1)

### Key types (`src/types/task.ts`)

- `Status`: `"todo" | "in_progress" | "review" | "done"`
- `Priority`: `"urgent" | "high" | "medium" | "low"`
- `MEMBERS`: hardcoded array of five team members (name stored as `assignee_id` text).
- `STATUS_CONFIG` / `PRIORITY_CONFIG`: label + Tailwind colour class — import these instead of duplicating strings.

### UI stack

- **shadcn/ui with Base UI** (`components.json` style: `base-nova`). Primitives are in `src/components/ui/`.
- **Tailwind CSS v4** — no `tailwind.config.ts`; configuration is handled via PostCSS (`postcss.config.mjs`). Class names go directly in JSX.
- Path alias `@/*` resolves to `src/*`.

### Base UI quirks

- `DropdownMenuTrigger` does NOT support `asChild` — use `className` directly on it.
- `Select.onValueChange` returns `string | null` — always null-coalesce: `(v) => setState(v ?? "fallback")`.
- Use non-empty sentinel values (e.g. `"all"`, `"none"`) instead of `""` for Select options that mean "unset".
- The lint rule `react-hooks/set-state-in-effect` forbids synchronous `setState` in `useEffect` bodies — put state updates in `.then()` callbacks or use key-based remounting to avoid `useEffect` entirely.
