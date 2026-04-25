# CLAUDE.md

# Project Overview
This project is a high-performance Task Management platform specifically designed for creative teams. The core focus is on asset-centric workflows, allowing teams to manage rich media attachments, track granular progress on creative iterations, and maintain a seamless bridge between design assets and task completion.

## Tech Stack
- TypeScript: Strict mode; `any` and `unknown` are strictly prohibited.
- Next.js: App Router with Partial Prerendering (PPR) enabled.
- Tailwind CSS: Utility-first styling; no custom CSS.
- Shadcn UI: Base component library for all UI elements.
- Prisma & PostgreSQL: Type-safe ORM and relational database.
- Redis (ioRedis): Response caching via SuperJSON serialization.
- Zod: Schema validation for both API inputs and Forms (via `zodResolver`).
- NextAuth.js v5: Server-side identity management (AWS Cognito + Credentials).
- Biome: Formatter and linter (replaces ESLint/Prettier).

## Commands
- `yarn dev` — Start the development server (Turbopack).
- `yarn build` — Compile the production build.
- `yarn lint` — Format and lint with Biome (auto-fix).
- `yarn prisma:update` — Push schema changes to DB and regenerate client (`db push && generate`).

## Architecture

### Directory Layout
```
app/              # Next.js App Router pages
  (app)/          # Protected routes (require auth)
  (public)/       # Public-facing pages
  auth/           # Auth flow pages (login, register, verify)
  api/db/         # REST API routes, e.g. /tenant/:tenantId/organization/:orgId/...
server/           # All server-side business logic
  auth/           # NextAuth config, Cognito SDK wrappers
  middleware/     # Request middleware chain
  modules/        # Feature modules by domain
  shared/         # Cross-cutting: db, logger, permissions, IAM, scoped-db, redis
src/              # Client-side code
  components/     # React components (UI + domain-shared)
  modules/        # Feature modules (tenant, organization, project, shared)
  lib/            # Client utilities (Axios api.ts instance at /api/db/)
prisma/           # Schema, migrations, seed data
```

### TypeScript Path Aliases
- `@auth` → `server/auth/auth.ts`
- `@db` → `server/shared/utils/db.ts`
- `@scopedDb` → `server/shared/infrastructure/scoped-db.ts`
- `@logger` → `server/shared/utils/logger.ts`
- `@api` → `src/lib/api.ts`
- `@hooks` → `src/modules/shared/hooks/index.ts`
- `@server/*` → `server/*`
- `@ui/*` → `src/components/ui/*`
- `@src/*` → `src/*`

### API Middleware Chain
Every API handler is wrapped via `createRoute` (authenticated) or `createPublicRoute` (public):

```
withCore → withAuth → withTransaction → withValidation → handler
```

- **`withCore`**: Adds `requestId`, structured logging, centralized Zod/Prisma error mapping, slow-request detection (>500ms).
- **`withAuth`**: Validates NextAuth session, enforces IDOR protection (URL path IDs must match session `tenantId`/`organizationId`), checks `allowedTenantRoles`, evaluates IAM `permissions`, and builds `ScopedDb`.
- **`withTransaction`**: Wraps mutating requests (POST/PUT/PATCH/DELETE) in a Prisma transaction; rolls back on non-2xx response.
- **`withValidation`**: Parses and validates URL path params, query params, and request body against Zod schemas.

### Route Definition Pattern
```ts
export const GET = createRoute(
  {
    params: myParamsSchema,          // Zod schema for URL path + query params
    body: myBodySchema,              // Zod schema for request body (mutations)
    pathPattern: '/tenant/:tenantId/organization/:organizationId/resource',
    auth: {
      allowedTenantRoles: 'ANY',     // or specific TenantRole[]
      permissions: P.resource.read,  // IAM permission check
    },
  },
  async (req, ctx, { params, body }) => {
    const { db, logger } = ctx        // ScopedDb + logger injected
    // ...
  },
)
```

### Multi-Tenancy: ScopedDb
`getScopedDb(tenantId, organizationId)` returns a Prisma client extension that auto-injects `tenantId` / `organizationId` into all WHERE clauses and CREATE data. Never bypass it — all DB access must go through `ScopedDb` (from `ctx.db` in handlers).

**Model scoping rules:**
- Tenant-scoped: `Organization`
- Org-scoped: `Project`, `Task`, `Member`, `Team`, `TeamMember`, `ProjectTeam`, `Tag`, `OrganizationInvitation`, `ProjectMember`, `Milestone`, `Comment`, `Expense`, `Notification`, `Favourite`
- Tenant-inclusive (system + tenant records): `Role`, `Policy`

### Permissions & IAM
Define permissions in `server/shared/domain/permissions.ts` using the `P` helper:
- `P.resource.read` → `'resource:read'`
- `P.resource.create` → `'resource:create'`

Routes declare `permissions` in their `auth` config. `withAuth` evaluates the user's IAM Role → Policy → PolicyStatement chain. Fine-grained resource-level access is checked in the features layer.

### Server Module Structure
Each feature module under `server/modules/<domain>/` follows:
```
features/<action>/
  handler.ts    # Business logic command/query receiving AppContext ({ db, logger })
  schema.ts     # Zod schemas for params + body
domain/
  <model>.entity.ts  # Domain types and validation
infrastructure/
  <model>.repo.ts    # Data access layer (uses ScopedDb)
```

## Coding Rules

**Component Locality:**
- Page-specific components: same folder as `page.tsx` under `/components` (UI) or `/additional` (helpers).
- Domain-shared components: `src/components/[model]/`.
- One component per file. Every file starts with a comment indicating its filepath.

**Patterns:**
- **Forms**: Always use `zodResolver` with a Zod schema.
- **Tables**: Use the `DataTable` component. Extract columns to a separate file using `columnHelper` style, wrapped in `useMemo`.
- **Data fetching**: Maximize Server Components. Use Server Actions for mutations. Access auth IDs server-side.
- **Functional style**: Always use arrow functions for components and logic.

## Partial Prerendering (PPR)
- Wrap dynamic components in `<Suspense>` with a meaningful fallback.
- Push dynamic data fetching (`auth()`, Prisma calls) as deep into the component tree as possible — never `await` at page level if it can be scoped to a child component.
- Isolate slow-moving assets or heavy computations in their own `<Suspense>` boundaries.

## Security Checklist
- **Tenant isolation**: `ScopedDb` injects `tenantId` and `organizationId` on all queries. Never bypass it.
- **IDOR**: `withAuth` compares URL path params (`:tenantId`, `:organizationId`) to session values via `pathPattern`.
- **Role enforcement**: Set `allowedTenantRoles` and/or `permissions` explicitly in every `createRoute` call.
- **IAM**: Fine-grained permissions use `Role` → `Policy` → `PolicyStatement`. Check in the features layer for resource-level access.
- **Input validation**: All external input goes through Zod before reaching any handler.
- **No raw SQL**: All DB access via Prisma with `ScopedDb`.