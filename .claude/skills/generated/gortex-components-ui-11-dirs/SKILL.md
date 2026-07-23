---
name: gortex-components-ui-11-dirs
description: "Work in the components/ui +11 dirs area — 177 symbols across 17 files (78% cohesion)"
---

# components/ui +11 dirs

177 symbols | 17 files | 78% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/(app)/organization/[organizationId]/projects/[name]/create/[type]/layout.tsx`
- `external-call::stdlib:superjson`
- `prisma/generated/client/index.d.ts`
- `server/modules/task/features/delete-task/schema.ts`
- `server/shared/utils/db.ts`
- `server/shared/utils/redis/index.ts`
- `server/shared/utils/redis/types.ts`
- `src/components/CookieConsent.tsx`
- `src/components/Sidebar/RecentsNav.tsx`
- `src/components/Tables/Filters/filter-fns.ts`
- `src/components/ui/color-picker.tsx`
- `src/components/ui/mask-input.tsx`
- `src/components/ui/time-picker.tsx`
- `src/lib/data-grid.ts`
- `src/modules/pm/tasks/tasks.api.ts`
- `src/modules/pm/tasks/tasks.hooks.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | search, replaceAll, all, includes |
| `app/(app)/organization/[organizationId]/projects/[name]/create/[type]/layout.tsx` | awaitedParams, Layout, validTypes |
| `external-call::stdlib:superjson` | superjson |
| `prisma/generated/client/index.d.ts` | ModelName |
| `server/modules/task/features/delete-task/schema.ts` | DeleteTasksBulkRequest |
| `server/shared/utils/db.ts` | prismaClient, cacheMiddleware, adapter, redisAdapter, prismaClientSingleton |
| `server/shared/utils/redis/index.ts` | fetchFromPrisma, args, createPrismaRedisCache, result |
| `server/shared/utils/redis/types.ts` | PrismaQueryAction, CreatePrismaRedisCache, PrismaAction, PrismaMutationAction |
| `src/components/CookieConsent.tsx` | setIsOpen, decline, decline, CookieConsent, wrapperClass, ... |
| `src/components/Sidebar/RecentsNav.tsx` | isLoading, pathname, RecentsNav, projects |
| `src/components/Tables/Filters/filter-fns.ts` | columnId, row, inEnumSetFilterFn, filterValue, cellValue |
| `src/components/ui/color-picker.tsx` | InputElement |
| `src/components/ui/mask-input.tsx` | result, displayValue, key, i, sample, ... |
| `src/components/ui/time-picker.tsx` | getIs12Hour, formatted, testDate, locale |
| `src/lib/data-grid.ts` | type, getFileIcon |
| `src/modules/pm/tasks/tasks.api.ts` | data, deleteTaskFn, projectId, projectId, payload, ... |
| `src/modules/pm/tasks/tasks.hooks.ts` | deleteMany.useMutation, qc, delete.useMutation, qc |

## Entry Points

- `src/components/ui/mask-input.tsx::MaskInput`

## Connected Communities

- **components/ui +15 dirs** (31 cross-edges)
- **components/ui +97 dirs** (17 cross-edges)
- **. +9 dirs** (3 cross-edges)
- **. +2 dirs · currency.transform** (3 cross-edges)
- **components/ui +23 dirs** (2 cross-edges)
- **components/ui +3 dirs** (1 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **projects/workflow +20 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-237"
smart_context with task: "understand components/ui +11 dirs", format: "gcx"
find_usages with id: "src/components/ui/mask-input.tsx::MaskInput", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
