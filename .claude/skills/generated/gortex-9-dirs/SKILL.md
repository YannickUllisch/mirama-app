---
name: gortex-9-dirs
description: "Work in the . +9 dirs area — 94 symbols across 10 files (66% cohesion)"
---

# . +9 dirs

94 symbols | 10 files | 66% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/(app)/portal/_components/PortalChooser.tsx`
- `app/(app)/portal/onboarding/page.tsx`
- `app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationGrid.tsx`
- `app/(app)/tenant/[tenantId]/roles/create/page.tsx`
- `src/components/Calendar/validation/event.ts`
- `src/components/Tree/ContainerizedTree.ts`
- `src/components/ui/mask-input.tsx`
- `src/lib/data-grid.ts`
- `src/modules/tenant/iam/roles/components/RoleForm.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | push, split |
| `app/(app)/portal/_components/PortalChooser.tsx` | handleEnterTenant, router, getGreeting, firstName, hour, ... |
| `app/(app)/portal/onboarding/page.tsx` | router, onCompletedOnboarding, OnboardingPage, update |
| `app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationGrid.tsx` | updateSession, organizations, OrganizationGrid, handleEnterOrg, handleEditOrg, ... |
| `app/(app)/tenant/[tenantId]/roles/create/page.tsx` | defaultScope, CreateRolePage |
| `src/components/Calendar/validation/event.ts` | hours, time, date, combinedDate, minutes, ... |
| `src/components/Tree/ContainerizedTree.ts` | trees, root, groupTasksByContainer, flattenedSubtasks, stack, ... |
| `src/components/ui/mask-input.tsx` | value, ipv4.validate, i, chunks, segments |
| `src/lib/data-grid.ts` | line, maxTabCount, rows, parseTsv, nextChar, ... |
| `src/modules/tenant/iam/roles/components/RoleForm.tsx` | data, createRole, newScope, handleSubmit, handleScopeChange, ... |

## Connected Communities

- **components/ui +97 dirs** (14 cross-edges)
- **components/ui +15 dirs** (5 cross-edges)
- **components/ui +23 dirs** (3 cross-edges)
- **components/ui +11 dirs** (2 cross-edges)
- **modules · optimisticList** (2 cross-edges)
- **. +2 dirs · currency.transform** (1 cross-edges)
- **components/Skeletons +17 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-242"
smart_context with task: "understand . +9 dirs", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
