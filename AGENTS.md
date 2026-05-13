# My Smart Warehouse Agent Guide

## Project Structure

- `frontend` contains the web app.
- `backend` contains the NestJS API.
- `packages/shared` is the shared contract package for schemas, types, and API-facing utilities.

## Shared Schema Rule

- Treat `packages/shared` as the single source of truth for any API contract shared by frontend and backend.
- Put request and response Zod schemas in `packages/shared/src/schemas`.
- Export shared schemas and inferred types from `packages/shared/src/index.ts`.
- Frontend must import these schemas and inferred types from `@warehouse/shared` instead of redefining payload shapes locally.
- Backend must import the same schemas from `@warehouse/shared` instead of recreating equivalent Zod objects or `class-validator` DTOs.

## Backend Validation Rule

- NestJS validation must use reusable Zod validation pipes that consume schemas from `@warehouse/shared`.
- Do not duplicate validation rules in controller-local Zod objects when the schema belongs to the API contract.
- Do not create parallel DTO classes for shapes that already exist as shared Zod schemas.
- Prefer pipe-based validation at `@Body()`, `@Query()`, and `@Param()` boundaries over calling `schema.parse()` or helper parsing inline in each handler.
- Keep Zod error mapping centralized in backend common utilities and pipes so validation behavior stays consistent.

## Schema Design Guidelines

- Build schemas compositionally: base schema, create schema, update schema, query schema, and small reusable fragments.
- Use `z.coerce` only where transport values actually need coercion, such as query strings or numeric form inputs.
- Keep business rules in services; keep transport validation in shared schemas and backend pipes.
- If a shape is backend-internal only and never crosses the API boundary, it may stay local to the backend.

## Change Workflow

- When changing an API contract, update `packages/shared` first.
- Then update backend handlers and validation pipes to consume the shared schema.
- Then update frontend forms, API calls, and UI types to import the same shared schema or inferred types.
- Avoid any frontend/backend validation drift.
