---
name: gortex-projects-workflow-20-dirs
description: "Work in the projects/workflow +20 dirs area — 195 symbols across 28 files (81% cohesion)"
---

# projects/workflow +20 dirs

195 symbols | 28 files | 81% cohesion

## When to Use

Use this skill when working on files in:
- `app/(app)/tenant/[tenantId]/roles/_components/RoleColumns.tsx`
- `external-call::stdlib:zod`
- `prisma/generated/client/edge.js`
- `prisma/generated/client/index-browser.js`
- `server/auth/auth.ts`
- `server/auth/helpers/queries.ts`
- `src/hooks/use-server-table.ts`
- `src/lib/data-table.ts`
- `src/lib/parsers.ts`
- `src/modules/api.types.ts`
- `src/modules/pm/projects/members/members.api.ts`
- `src/modules/pm/projects/milestones/milestones.api.ts`
- `src/modules/pm/projects/projects.api.ts`
- `src/modules/pm/projects/teams/teams.api.ts`
- `src/modules/pm/projects/workflow/workflow.api.ts`
- `src/modules/pm/projects/workflow/workflow.hooks.ts`
- `src/modules/pm/projects/workflow/workflow.types.ts`
- `src/modules/tenant/iam/policy/policy.api.ts`
- `src/modules/tenant/iam/policy/policy.hooks.ts`
- `src/modules/tenant/iam/policy/policy.types.ts`
- `src/modules/tenant/iam/roles/role.api.ts`
- `src/modules/tenant/iam/roles/role.types.ts`
- `src/modules/tenant/organization/invitations/invitations.api.ts`
- `src/modules/tenant/organization/members/members.api.ts`
- `src/modules/tenant/organization/organization.api.ts`
- `src/modules/tenant/organization/tags/tags.api.ts`
- `src/modules/tenant/organization/teams/teams.api.ts`
- `src/types/data-table.ts`

## Key Files

| File | Symbols |
|------|---------|
| `app/(app)/tenant/[tenantId]/roles/_components/RoleColumns.tsx` | RoleTableData |
| `external-call::stdlib:zod` | zod |
| `prisma/generated/client/edge.js` | getRuntime |
| `prisma/generated/client/index-browser.js` | get, PrismaClient, constructor |
| `server/auth/auth.ts` | callbacks.jwt, membership, me |
| `server/auth/helpers/queries.ts` | data, data, getOrganizationMembership, externalId, getUserByExternalId, ... |
| `src/hooks/use-server-table.ts` | UseServerTableOptions |
| `src/lib/data-table.ts` | getValidFilters, filters, TData |
| `src/lib/parsers.ts` | FilterItemSchema |
| `src/modules/api.types.ts` | PaginatedResponse, PaginationParams, T, itemSchema |
| `src/modules/pm/projects/members/members.api.ts` | fetchProjectMembersFn, organizationId, projectId, data, params |
| `src/modules/pm/projects/milestones/milestones.api.ts` | data, params, organizationId, projectId, fetchProjectMilestonesFn |
| `src/modules/pm/projects/projects.api.ts` | fetchProjectsFn, params, organizationId, data |
| `src/modules/pm/projects/teams/teams.api.ts` | projectId, fetchProjectTeamsFn, params, data, organizationId |
| `src/modules/pm/projects/workflow/workflow.api.ts` | data, organizationId, organizationId, data, params, ... |
| `src/modules/pm/projects/workflow/workflow.hooks.ts` | Vars |
| `src/modules/pm/projects/workflow/workflow.types.ts` | AddPriorityCommand, AddStatusCommand, UpdateStatusCommand, StatusResponse, PriorityResponse, ... |
| `src/modules/tenant/iam/policy/policy.api.ts` | params, data, data, f, fetchPolicyByIdFn, ... |
| `src/modules/tenant/iam/policy/policy.hooks.ts` | scope, scopePrefix, queryFn, fetchServerTable.useQuery, res, ... |
| `src/modules/tenant/iam/policy/policy.types.ts` | PolicyResponse |
| `src/modules/tenant/iam/roles/role.api.ts` | params, data, accessScope, fetchRolesWithPoliciesFn, tenantId |
| `src/modules/tenant/iam/roles/role.types.ts` | RoleWithPoliciesResponse |
| `src/modules/tenant/organization/invitations/invitations.api.ts` | fetchInvitationsFn, tenantId, data, params, params, ... |
| `src/modules/tenant/organization/members/members.api.ts` | data, fetchOrgMembersFn, organizationId, params |
| `src/modules/tenant/organization/organization.api.ts` | data, fetchOrganizationsFn, params, tenantId |
| `src/modules/tenant/organization/tags/tags.api.ts` | scope, paginationParams, organizationId, data, fetchTagsFn |
| `src/modules/tenant/organization/teams/teams.api.ts` | params, data, organizationId, fetchTeamsFn |
| `src/types/data-table.ts` | TableApiParams, TableMeta, ExtendedColumnFilter, QueryKeys |

## Connected Communities

- **components/ui +15 dirs** (7 cross-edges)
- **components/ui +97 dirs** (6 cross-edges)
- **. +3 dirs** (1 cross-edges)
- **iam/policy · fetchAll.useQuery** (1 cross-edges)
- **modules · optimisticList** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-291"
smart_context with task: "understand projects/workflow +20 dirs", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
