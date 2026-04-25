# How to set up this monorepo (lead-engineer style)

This doc explains the **structure**, **boundaries**, and **setup steps** for this pnpm monorepo.

---

## Step 0 — Define boundaries (prevents rewrites)

Treat this as architecture, not folder naming.

- **Backend owns**
  - Database schema (Drizzle)
  - Migrations and data access
  - API implementation (NestJS)
- **Shared package owns**
  - API contracts: **Zod schemas** + inferred TypeScript types
  - Utilities that are safe to run in both Node and the browser (optional)
- **Frontend owns**
  - UI and forms
  - Client-side validation using shared Zod schemas
  - API calls

**Anti-pattern**: importing Drizzle table schema into the frontend. You’ll fight bundlers, env separation, and security.

---

## Step 1 — Create the root workspace

Create a root `package.json`:

- Must include `"private": true`
- Optional but recommended: root scripts that call apps via `pnpm --filter ...`

Create a root `pnpm-workspace.yaml` listing workspaces (example):

```yaml
packages:
  - "frontend"
  - "backend"
  - "packages/*"
```

Lockfile policy:

- Keep **one** `pnpm-lock.yaml` at the repo root
- Avoid nested lockfiles inside `frontend/` or `backend/`

**Key principle**: workspaces are a dependency **graph**. The root is where pnpm computes and links that graph.

---

## Step 2 — Create a shared package (`packages/shared`)

Create `packages/shared/package.json` with a real name, e.g. `@warehouse/shared`.

Make it buildable:

- `src/` contains source
- `dist/` contains compiled output
- `main` / `types` / `exports` point to `dist/*`

Put Zod contracts here:

- `packages/shared/src/schemas/*.ts`
- `packages/shared/src/index.ts` re-exports public APIs

**Key principle**: shared packages should build cleanly and be versionable even if you never publish them.

---

## Step 3 — Wire apps to shared

Add the shared package dependency in both apps:

- `frontend/package.json`: `"@warehouse/shared": "workspace:*"`
- `backend/package.json`: `"@warehouse/shared": "workspace:*"`

For Next.js, make sure it transpiles workspace packages:

- `frontend/next.config.ts`: `transpilePackages: ["@warehouse/shared"]`

**Key principle**: Next.js will not always transpile TypeScript imported from outside the app unless you tell it to.

---

## Step 4 — Install once (from the repo root)

Always install from the root:

```bash
pnpm install
```

**Key principle**: installing from leaf packages is how you get multiple lockfiles and dependency drift.

---

## Step 5 — Put Drizzle in the backend only

Backend-only responsibilities:

- `backend/drizzle.config.ts` (drizzle-kit config)
- `backend/src/db/*` (connection, schema, migrations)
- `DATABASE_URL` comes from backend env only

Dependencies live in `backend/package.json`, e.g. `drizzle-orm`, `drizzle-kit`, and a driver like `pg`.

**Key principle**: DB access is privileged. Don’t let it cross the boundary into shared or frontend.

---

## Step 6 — Enforce formatting consistently

Recommended setup:

- Root `prettier.config.mjs` = shared base style (double quotes, etc.)
- Frontend can extend and add plugins (Tailwind class sorting)
- `.vscode/settings.json` turns on format-on-save using Prettier

**Key principle**: keep style decisions centralized; keep ecosystem-specific plugins localized.

---

## Step 7 — Stabilize tooling resolution (pnpm + TS + VS Code)

If you see editor-only errors like **“Cannot find module …”** while `tsc` builds fine:

- Pragmatic fix: enable hoisting in root `.npmrc`:

```ini
shamefully-hoist=true
```

- Stricter alternative: keep pnpm default isolation and tune TS/VS Code SDK resolution (more work, less convenient).

**Key principle**: optimize for team productivity unless you have a strong reason to enforce strict isolation.