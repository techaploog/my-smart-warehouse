# My Smart Warehouse

Modern **Next.js** frontend + **NestJS (Fastify)** backend, using **Drizzle ORM** and a shared **Zod contract package**.

## Repo layout

```text
.
├─ frontend/                  # Next.js app (UI)
├─ backend/                   # NestJS API (Fastify) + Drizzle
└─ packages/
   └─ shared/                 # @warehouse/shared (Zod schemas + types)
```

## Philosophy (what lives where)

- **backend**: database schema (Drizzle), migrations, data access, API implementation
- **packages/shared**: API contracts (Zod schemas) + inferred TypeScript types used by both apps
- **frontend**: UI, forms, client-side validation using the shared Zod schemas, API calls

## Prerequisites

- Node.js (recommended: current LTS)
- pnpm (v10+)

## Getting started

Install everything from the repo root:

```bash
pnpm install
```

Build the shared package (generates `packages/shared/dist`):

```bash
pnpm build:shared
```

Fist time seed running:
**seeding will truncate related table**

```bash
pnpm --filter backend db:migrate
pnpm --filter backend db:seed
```

Run apps:

```bash
pnpm dev:frontend   # http://localhost:3000
pnpm dev:backend    # http://localhost:3300
```

## Shared contracts (Zod)

The shared package exports Zod schemas and DTO types:

```ts
import { createProductSchema, type CreateProductDto } from "@warehouse/shared";
```

## Database (Drizzle, backend only)

Drizzle lives in `backend/src/db`:

- `backend/src/db/schema.ts`: tables
- `backend/src/db/index.ts`: db connection + exports
- `backend/drizzle.config.ts`: drizzle-kit config

Set `DATABASE_URL` for the backend (example):

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/warehouse"
```

Migration helpers:

```bash
pnpm --filter backend db:generate
pnpm --filter backend db:migrate
pnpm --filter backend db:studio
```

## Formatting (Prettier on save)

- Shared base config: `prettier.config.mjs` (double quotes)
- Frontend extends it: `frontend/prettier.config.mjs` (adds Tailwind class sorting)
- VS Code: `.vscode/settings.json` enables format-on-save with Prettier

## Monorepo setup notes

If you're learning the “why” behind the structure, see:

- `learning-by-doing/0. How to set up this monorepo`
