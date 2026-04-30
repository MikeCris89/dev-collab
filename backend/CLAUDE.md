# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                              # tsx watch (hot-reload)
npm run build                            # tsc, then deploys Prisma migrations + generates client
npm start                                # Run compiled dist/server.js
npx prisma migrate dev --name <name>     # Create a new migration
npx prisma studio                        # Open Prisma DB GUI
```

## Environment

Required in `backend/.env`:

```
JWT_SECRET=
DATABASE_URL=          # PostgreSQL (Supabase)
PUBLIC_URL=            # Frontend origin, used for CORS
```

## Stack

Express 5, TypeScript (strict), Prisma 6 + PostgreSQL (Supabase), JWT + bcrypt, DOMPurify (isomorphic), Morgan, Helmet.

## Architecture

### Entry Point

[src/server.ts](src/server.ts) wires up global middleware (CORS, cookies, Helmet, Morgan) and mounts all routers under `/api`.

### Routes

| Router        | Path            | Auth                                      |
| ------------- | --------------- | ----------------------------------------- |
| `auth.ts`     | `/api/auth`     | Public                                    |
| `team.ts`     | `/api/team`     | `requireAuth`                             |
| `projects.ts` | `/api/projects` | `requireAuth` + `adminOnly` for write ops |
| `folders.ts`  | `/api/folders`  | `requireAuth` + `adminOnly` for write ops |
| `notes.ts`    | `/api/notes`    | `requireAuth`                             |

### Authentication & Authorization

JWT is stored in an HTTPOnly cookie named `session` (7-day expiry). Middleware lives in [src/lib/middleware.ts](src/lib/middleware.ts):

- `requireAuth` — validates the cookie JWT, attaches the user to `req`
- `adminOnly` — rejects requests where `role !== ADMIN`

Use `reqUser(req)` from [src/types/types.ts](src/types/types.ts) to extract the typed user from a request inside route handlers.

### Error Handling

Throw typed errors from [src/lib/errors.ts](src/lib/errors.ts) — the global handler in `middleware.ts` serialises them:

```ts
throw new BadRequestError("message"); // 400
throw new NotFoundError("message"); // 404
throw new UnauthorizedError("message"); // 401
```

Prisma's `P2025` (record not found) is mapped to `NotFoundError` by the global handler.

### Validation & Sanitization

Helpers in [src/lib/utils.ts](src/lib/utils.ts) validate and sanitize all inputs before they reach the DB. Note body HTML is sanitized with DOMPurify using a tag allowlist that supports Tiptap output (`p`, `strong`, `em`, `ul`, `ol`, `li`, `a`, `blockquote`, `code`, `pre`, `input`, `label`, etc.).

Max-length limits come from the `LIMITS` constant in `@shared/contract` — do not hardcode them locally.

### Database

Prisma schema at [prisma/schema.prisma](prisma/schema.prisma). Key models:

```
User (role: ADMIN | TEAM)  →  Team  →  Project  →  Folder  →  Note  →  Comment
                                             ↕ (many-to-many via ProjectsUser)
                                           User
```

All IDs are CUID2. Deleting a Team/Project/Folder cascades to children. Deleting a User or Comment sets related foreign keys to `null`.

### Shared Contract

Types and constants are imported from `@shared/contract` (the `../contract` package). Never redefine types or validation constants locally. Key exports:

- **Types**: `JwtUser`, `User`, `Note`, `Folder`, `Project`, `Team`, DTOs
- **Constants**: `ROLES` (role string values), `LIMITS` (all max-length/count caps), `FORMS`

See [../contract/src/](../contract/src/) for the full catalogue.

### Frontend

The frontend lives in [../frontend/](../frontend/). It consumes this API via Axios with `withCredentials: true`. See `../frontend/CLAUDE.md` for its architecture.

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
