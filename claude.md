# Mirama — Project Context & Coding Guide

**Stack:** Next.js 16 App Router · TypeScript · Prisma (PostgreSQL) · TanStack Query · Tailwind CSS · Shadcn UI · NextAuth · Pino · Zod · Axios · Sonner

---

## 1. Architecture Overview

### Domain-Driven Design (DDD)
Logic is organised around aggregate roots: **Tenant → Organization → Project → Task → Expense**. Each lives in `server/modules/{entity}/` split into three layers:

| Layer | Path | Responsibility |
|---|---|---|
| `domain/` | `*.entity.ts` | Pure domain logic, static methods, business rules, no DB access |
| `features/` | `{use-case}/handler.ts` + `schema.ts` | Use-case commands/queries, calls the repo, returns typed response DTOs |
| `infrastructure/` | `*.repo.ts` | All Prisma queries via the `ScopedDb` context |

### Request Pipeline (`createRoute`)
Every API route handler is built with `createRoute`, composing four middleware wrappers in order:

```
withCore → withAuth → withTransaction → withValidation → handler
```

1. **`withCore`** — Generates `requestId`, starts a Pino child logger, times the request, catches all unhandled errors (Zod, Prisma, generic). Attaches `x-request-id` to every response. Logs requests slower than 500 ms as warnings.
2. **`withAuth`** — Reads the NextAuth session. Enforces authentication (401), IDOR protection (validates path `:tenantId`/`:organizationId` against session values → 403), then checks `allowedTenantRoles` and `allowedOrgRoles`. Creates the `PrivateAuthContext` including a `ScopedDb` instance and a child logger with `{tenantId, organizationId, userId}`.
3. **`withTransaction`** — Wraps all mutating methods (POST/PUT/PATCH/DELETE) in a `db.$transaction`. If the handler returns a non-2xx response it throws `TransactionRollback` to rollback automatically.
4. **`withValidation`** — Parses path params (from `pathPattern` + URL) and search params into `data.params`, parses the JSON body into `data.body`, both validated with their respective Zod schemas. Only parses body on POST/PUT/PATCH.

**Route example** (`app/api/db/organization/[organizationId]/task/route.ts`):
```ts
export const POST = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: GetTasksParamsSchema,       // Zod — path + query params
    body: CreateTaskSchema,             // Zod — request body
    pathPattern: '/api/db/organization/:organizationId/task',
  },
  async (_req, { session, ctx }, { params, body }) => {
    const data = await CreateTaskCommand(ctx)(session.user.id, false, body)
    return Response.json({ success: true, data }, { status: 201 })
  },
)
```

### Context Types (`server/middleware/types.ts`)
```
BaseContext       { requestId, logger, startTime }
  └─ AuthContext  { ctx: AppContext, session | null, isPublic }
       └─ PrivateAuthContext  { session: Session, isPublic: false }
```
`AppContext` = `{ db: ScopedDb, logger: Logger }`  
All feature handlers accept `AppContext` — use `ctx.db` and `ctx.logger` (never `console.log`).

---

## 2. Multi-Tenancy & `ScopedDb`

`getScopedDb(tenantId, organizationId?)` in `server/shared/infrastructure/scoped-db.ts` returns a Prisma extension that **automatically injects** `tenantId` / `organizationId` into every query's `where`/`data` clause.

- **Tenant-scoped models:** `Organization`
- **Tenant-inclusive models (tenantId=null = system-level):** `Role`, `Policy`
- **Org-scoped models:** `Project`, `Task`, `Member`, `Team`, `Tag`, `OrganizationInvitation`, `ProjectMember`, `Milestone`, `Comment`, `Expense`, `Notification`, `Favourite`
- Models not in any set (e.g., `User`, `Account`, `Tenant`) pass through unmodified.

**CRITICAL:** Never call raw `db.task.findMany(...)` from a route handler. Always pass `ScopedDb` through `ctx.db` so tenant/org isolation is enforced automatically. A query without context throws at runtime.

---

## 3. Data Model Summary (`prisma/schema.prisma`)

### Identity & Billing
- **`User`** — Auth identity. Has one optional `Tenant` and many `Member` links.
- **`Tenant`** — Root aggregate. Has `adminUserId`, `Subscription`, `TenantSettings`, `UsageMetric[]`, `AuditLog[]`, `Role[]`, `Policy[]`.
- **`Account`** — NextAuth OAuth accounts (provider/providerAccountId unique).
- **`Subscription`** → `Plan` (priceId, features JSON, Stripe subscriptionId, `SubscriptionStatus`).
- **`TenantSettings`** — Branding, timezone, notifications toggle, `isActive`.
- **`AuditLog`** — Immutable log of tenant actions with `action`, `entity`, `entityId`, `metadata JSON`, `ipAddress`.

### IAM
- **`Role`** — Can be tenant-scoped or system-level (`tenantId = null`). Linked to `Policy[]` via `RolePolicies`.
- **`Policy`** — Contains `PolicyStatement[]`. `isManaged=true` = system-protected.
- **`PolicyStatement`** — `effect` (ALLOW/DENY), `action` string, `resource` (default `*`).

### Organization
- **`Organization`** — Belongs to `Tenant`. Has `name`, `slug`, `street`, `city`, `state`, `zipCode`.
- **`Member`** — Join between `User` and `Organization`. Has `OrganizationRole` (OWNER/ADMIN/USER/FREELANCE/CLIENT) and an `iamRole`.
- **`Team`** — Groups of `Member[]` within an org.
- **`OrganizationInvitation`** — `email` is PK. Has `InvitationStatus` (PENDING/ACCEPTED/DECLINED) and expiry.
- **`Tag`** — Org-scoped, can be linked to `Project[]` and `Task[]`.

### Project
- **`Project`** — `name`, `description`, `startDate`, `endDate`, `PriorityType`, `StatusType` (ACTIVE/CANCELLED/ON_HOLD/FINISHED), `budget`, `archived`.
- **`ProjectMember`** — Join table with `isManager` flag.
- **`Milestone`** — `date`, `title`, `colors`, belongs to `Project`.

### Task
- **`Task`** — `taskCode` (generated prefix+hash), `TaskType` (ISSUE/STORY/TASK/TEST/FEATURE/EPIC), `title`, `description`, `PriorityType`, `TaskStatusType` (NEW/ACTIVE/DONE), `startDate`, `dueDate`, recursive `parentId`/`subtasks`.
- **`Comment`** — Belongs to `Task`, supports nested replies via `parentId`.

### Financial
- **`Expense`** — `amount`, `title`, `ExpenseType` (LABOR/MATERIALS/SOFTWARE/TRAVEL/SERVICES/LICENSING/ADMINISTRATIVE/MISC), optional `projectId`.

### UX
- **`Notification`** — `memberId`, `sender`, `title`, `isRead`, `resourceId`.
- **`Favourite`** — `FavouriteType` (PROJECT/TASK/ROUTE), `data` string.

---

## 4. Feature Handler Pattern

Every use-case follows this exact pattern (curried `AppContext`):

```ts
// handler.ts
export const CreateTaskCommand =
  ({ db, logger }: AppContext) =>
  async (sessionUserId: string, isAdminOrOwner: boolean, input: CreateTaskRequest) => {
    logger.info({ projectId: input.projectId }, 'Creating task')

    // 1. Domain assertions (pure, no DB)
    TaskEntity.assertNotContainerWithParent(input.type, input.parentId)

    // 2. Repository call via ScopedDb
    const repo = TaskRepository(db)
    const project = await repo.findProjectMembers(input.projectId)
    if (!project) throw new Error('Project not found')

    // 3. Permission check
    TaskEntity.assertProjectMemberOrAdmin(
      project.members.map((m) => m.memberId),
      sessionUserId,
      isAdminOrOwner,
    )

    // 4. Write & return DTO
    const task = await repo.create({ ...input, id: randomUUID(), taskCode: TaskEntity.generateTaskId(...) })
    return toTaskResponse(task)
  }
```

Schemas live in `schema.ts` next to the handler:
```ts
// schema.ts
export const CreateTaskSchema = z.object({ title: z.string().min(1), ... })
export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>
```

Response DTOs live in `features/response.ts` — never expose raw Prisma models to the client.

---

## 5. Repository Pattern

Repositories are factory functions (not classes) accepting `ScopedDb`:

```ts
export const TaskRepository = (db: ScopedDb) => ({
  async findByProject(opts: { projectId: string; ignoreCompleted: boolean }) {
    return db.task.findMany({ where: { projectId: opts.projectId, ... }, include: TASK_INCLUDE })
  },
  ...
})
```

Define a single `TASK_INCLUDE` / `PROJECT_INCLUDE` const at the top of the repo file and reuse it — ensures consistent eager-loading and avoids N+1s.

---

## 6. Frontend Hooks (`src/hooks/`)

Three sub-directories:

| Dir | Purpose |
|---|---|
| `hooks/api/` | Raw `axios` fetch functions (one file per entity, e.g. `task.ts`) |
| `hooks/query/` | TanStack Query hooks (`useQuery` / `useMutation`), one file per entity |
| `hooks/utils/` | Generic helper hooks |

`hooks/query/index.ts` exports a single `apiRequest` object combining all query hooks:
```ts
import apiRequest from '@hooks/query'
const { data } = apiRequest.task.fetchByProject.useQuery(projectId)
```

**Optimistic update pattern** (required for task/project mutations):
```ts
onMutate: async ({ id, payload }) => {
  await qc.cancelQueries({ queryKey: ['tasks', id] })
  const previous = qc.getQueryData<TaskResponse[]>(['tasks', id])
  qc.setQueryData(['tasks', id], (old) => [...(old ?? []), optimisticItem])
  return { previous }
},
onError: (_err, _vars, ctx) => {
  qc.setQueryData(['tasks', id], ctx?.previous)
  toast.error('...')
},
onSettled: () => qc.invalidateQueries({ queryKey: ['tasks', id] }),
```

API base URL: `axios` instance in `src/lib/api.ts` pointing to `/api/db/` with `withCredentials: true`.

---

## 7. API Route Conventions

- All routes are under `app/api/db/` with a resource path matching the domain hierarchy.
- Common structure: `app/api/db/organization/[organizationId]/[resource]/route.ts`
- `pathPattern` must match the actual Next.js route (used for IDOR checking and param extraction).
- Auth config uses `allowedTenantRoles` and/or `allowedOrgRoles`. Use `'ANY'` to allow all authenticated members of that scope.
- The handler receives `{ session, ctx }` — `session.user` contains `id`, `tenantId`, `organizationId`, `tenantRole`, `orgRole`.

---

## 8. Coding Standards

### Server-side
- **Always use `createRoute`.** Never manually call `auth()`, `req.json()`, or `db` inside a route handler.
- **Use `ctx.ctx.logger`** (injected Pino child), never `console.log`.
- **Transactions are automatic** for mutating routes via `withTransaction`. Do not manually call `db.$transaction` inside a handler unless you need explicit savepoints.
- **Throw errors from features** — `withCore` catches and maps them to correct HTTP responses.

### Frontend
- Use **Tailwind CSS + Shadcn UI** only. Do not add new UI libraries.
- Use `'use client'` only for components that need interactivity or browser APIs.
- Use **URL search params** for filters, pagination, and sort state so routes are shareable and SSR-friendly.
- Split components at ~150 lines. Extract sub-components rather than comments.
- Use **`toast` from `sonner`** for user feedback on mutations.

---

## 9. Full Folder Structure

```
app/
├── (app)/                   # Authenticated app shell
│   ├── organization/[organizationId]/
│   └── tenant/[tenantId]/
├── (public)/                # Marketing pages (layout, about, contact, privacy…)
├── api/
│   ├── auth/[...nextauth]/  # NextAuth route
│   └── db/                  # All business API routes
│       ├── contact/
│       ├── organization/[organizationId]/
│       │   ├── route.ts             # PUT update org
│       │   ├── favourite/
│       │   ├── invitation/
│       │   ├── member/
│       │   ├── project/[projectId]/
│       │   ├── tag/
│       │   └── task/[taskId]/
│       └── tenant/[tenantId]/
├── auth/                    # Login, register, forgot-password, verify…
server/
├── auth/                    # NextAuth config, adapters, cognito
├── middleware/
│   ├── createRoute.ts       # Compose pipeline
│   ├── withAuth.ts          # Session + IDOR + role enforcement
│   ├── withCore.ts          # requestId, logging, error handling
│   ├── withTransaction.ts   # Auto-transaction + rollback on non-2xx
│   ├── withValidation.ts    # Zod params + body parsing
│   └── types.ts             # BaseContext, AuthContext, HandlerData
├── modules/
│   ├── account/             # Org/member/invitation management
│   ├── billing/             # Subscription, plan, Stripe
│   ├── project/             # Project CRUD, members, milestones
│   └── task/
│       ├── domain/task.entity.ts          # TaskEntity static methods
│       ├── features/
│       │   ├── create-task/{handler,schema}.ts
│       │   ├── delete-task/{handler,schema}.ts
│       │   ├── get-task/{handler,schema}.ts
│       │   ├── get-tasks/{handler,schema}.ts
│       │   ├── update-task/{handler,schema}.ts
│       │   ├── comments/
│       │   └── response.ts                # TaskResponse + SimpleTaskResponse DTOs
│       └── infrastructure/task.repo.ts    # TaskRepository factory
└── shared/
    ├── domain/              # Shared domain types
    ├── infrastructure/
    │   ├── scoped-db.ts     # getScopedDb — auto-injects tenantId/orgId
    │   └── types.ts         # AppContext type
    └── utils/
src/
├── components/              # Shadcn + custom UI, split by concern
├── core/                    # Org/tenant bootstrap components
├── hooks/
│   ├── api/                 # Axios fetch functions (task.ts, project.ts…)
│   ├── query/               # TanStack query hooks with optimistic updates
│   └── utils/               # Generic helpers
├── lib/
│   ├── api.ts               # Axios instance → /api/db/
│   └── utils.ts
├── modules/                 # Client-side feature modules (forms, views)
├── routes.ts                # Typed route constants
└── types/                   # Global TS augmentations (next-auth, superjson)
prisma/
├── schema.prisma
└── seed.ts
```

---

## 10. Security Checklist

- **Tenant isolation:** `ScopedDb` injects `tenantId` on all queries. Never bypass it.
- **IDOR:** `withAuth` compares URL path params (`:tenantId`, `:organizationId`) to session values.
- **Role enforcement:** Set `allowedTenantRoles`/`allowedOrgRoles` explicitly in every `createRoute` call.
- **IAM:** Fine-grained permissions use `Role` → `Policy` → `PolicyStatement`. Check in the features layer for resource-level access.
- **Input validation:** All external input goes through Zod before reaching any handler.
- **No raw SQL:** All DB access via Prisma with `ScopedDb`.