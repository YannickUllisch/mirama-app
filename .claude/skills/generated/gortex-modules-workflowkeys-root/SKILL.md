---
name: gortex-modules-workflowkeys-root
description: "Work in the modules · workflowKeys.root area — 67 symbols across 3 files (65% cohesion)"
---

# modules · workflowKeys.root

67 symbols | 3 files | 65% cohesion

## When to Use

Use this skill when working on files in:
- `src/modules/pm/projects/workflow/workflow.api.ts`
- `src/modules/pm/projects/workflow/workflow.hooks.ts`
- `src/modules/tenant/organization/organizationResourceContext.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/modules/pm/projects/workflow/workflow.api.ts` | organizationId, statusId, organizationId, projectId, projectId, ... |
| `src/modules/pm/projects/workflow/workflow.hooks.ts` | queryClient, queryClient, queryClient, removeTaskStatus.useMutation, workflowKeys.root, ... |
| `src/modules/tenant/organization/organizationResourceContext.tsx` | useOrganizationResource, ctx |

## Connected Communities

- **projects/workflow +20 dirs** (13 cross-edges)
- **components/ui +15 dirs** (2 cross-edges)
- **components/Tables +7 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-304"
smart_context with task: "understand modules · workflowKeys.root", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
