# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server (binds 0.0.0.0)
npm run build      # Type-check + Vite build (also builds contract/ via prebuild)
npm run lint       # ESLint
npx playwright test           # Run all e2e tests
npx playwright test <file>    # Run a single test file
```

## Environment

`VITE_API_URL` — backend base URL (defaults to `http://localhost:4001`). The Axios client appends `/api` to all requests.

## Stack

React 19, React Router 7, TanStack React Query 5, Tailwind CSS 4, Tiptap 3 (rich text), Axios, TypeScript (strict), Vite, Playwright.

## Architecture

### Routing

Routes are defined in [src/routes.tsx](src/routes.tsx) using `createBrowserRouter`. The main URL pattern is:

```
/p/:projectId/f/:folderId/n/:noteId
```

Public routes (`/login`, `/signup`) redirect to `/` when already authenticated. All other routes require auth and redirect to `/login` otherwise.

### State Management

Two layers:

1. **React Context** — for session-level state that doesn't need server sync:
   - [AuthContext](src/context/AuthContext.tsx) — authenticated user, `login`, `signup`, `logout`, `refresh` (called on page load)
   - [GlobalContext](src/context/GlobalContext.tsx) — currently selected project/folder/note (driven by URL params), sidebar/menu state, form dirty flag

2. **TanStack React Query** — all server data. Config: 5-minute `staleTime`, 1 retry, `refetchOnWindowFocus: false`. Mutations update the cache in `onSuccess` (optimistic-style). Hooks live in `src/hooks/` (`useProjects`, `useFolders`, `useNotes`, `useTeam`).

### API Layer

[src/lib/api.ts](src/lib/api.ts) exports a configured Axios instance and typed helpers:

```ts
fetcher<T>(url); // GET
poster<TIn, TOut>(url, data); // POST
putter<TIn, TOut>(url, data); // PUT
deleter(url); // DELETE
```

Credentials are always sent (`withCredentials: true`) for cookie-based auth. The response interceptor normalises error shapes.

### Path Alias

`@/*` resolves to `src/*`. Always use this for internal imports.

### Shared Contract

Types and constants are imported from `@shared/contract` (the `../contract` package). Never redefine types or constants that exist there. Key exports:

- **Types**: `User`, `Note`, `Folder`, `Project`, `Team`, `NoteInput`, etc.
- **Constants**: `ROLES` (admin/team strings), `LIMITS` (max lengths), `FORMS` (form identifier keys)

See [../contract/src/](../contract/src/) for the full catalogue.

### Backend

The backend lives in [../backend/](../backend/). It exposes a REST API under `/api` with cookie-based JWT auth. See `../backend/CLAUDE.md` for its architecture.

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
