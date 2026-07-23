---
name: gortex-modules-optimisticlist
description: "Work in the modules · optimisticList area — 126 symbols across 11 files (78% cohesion)"
---

# modules · optimisticList

126 symbols | 11 files | 78% cohesion

## When to Use

Use this skill when working on files in:
- `src/modules/shared/hooks/helpers.ts`
- `src/modules/tenant/iam/components/MemberAccessTab.tsx`
- `src/modules/tenant/iam/policy/policy.api.ts`
- `src/modules/tenant/iam/policy/policy.hooks.ts`
- `src/modules/tenant/iam/policy/policy.types.ts`
- `src/modules/tenant/iam/roles/role.api.ts`
- `src/modules/tenant/iam/roles/role.hooks.ts`
- `src/modules/tenant/iam/roles/role.types.ts`
- `src/modules/tenant/organization/invitations/invitations.api.ts`
- `src/modules/tenant/organization/invitations/invitations.hooks.ts`
- `src/modules/tenant/tenant/tenantResourceContext.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `src/modules/shared/hooks/helpers.ts` | optimisticList, TVars, invalidateKey, opts, TData, ... |
| `src/modules/tenant/iam/components/MemberAccessTab.tsx` | Props |
| `src/modules/tenant/iam/policy/policy.api.ts` | addPolicyStatementFn, tenantId, data, payload, removePolicyStatementFn, ... |
| `src/modules/tenant/iam/policy/policy.hooks.ts` | activeTenantId, Vars, scope, fetchAllForScope.useQuery, tenantId, ... |
| `src/modules/tenant/iam/policy/policy.types.ts` | CreatePolicyCommand, AddPolicyStatementCommand, UpdatePolicyCommand |
| `src/modules/tenant/iam/roles/role.api.ts` | tenantId, roleId, payload, roleId, detachPolicyFn, ... |
| `src/modules/tenant/iam/roles/role.hooks.ts` | activeTenantId, roleKeys.tenant, activeTenantId, attachPolicy.useMutation, fetchAllByScopeForOrganization.useQuery, ... |
| `src/modules/tenant/iam/roles/role.types.ts` | UpdateRoleCommand, CreateRoleCommand, RoleResponse |
| `src/modules/tenant/organization/invitations/invitations.api.ts` | data, data, acceptInvitationFn, tenantId, declineInvitationFn, ... |
| `src/modules/tenant/organization/invitations/invitations.hooks.ts` | queryClient, decline.useMutation, activeTenantId, queryClient, accept.useMutation, ... |
| `src/modules/tenant/tenant/tenantResourceContext.tsx` | useTenantResource, ctx |

## Connected Communities

- **components/ui +97 dirs** (12 cross-edges)
- **components/ui +15 dirs** (6 cross-edges)
- **projects/workflow +20 dirs** (1 cross-edges)
- **components/ui +11 dirs** (1 cross-edges)
- **modules · workflowKeys.root** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-349"
smart_context with task: "understand modules · optimisticList", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
