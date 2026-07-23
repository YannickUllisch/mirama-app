---
name: gortex-generated-client-3-dirs
description: "Work in the generated/client +3 dirs area — 1157 symbols across 4 files (88% cohesion)"
---

# generated/client +3 dirs

1157 symbols | 4 files | 88% cohesion

## When to Use

Use this skill when working on files in:
- `prisma/generated/client/index.d.ts`
- `prisma/generated/client/runtime/client.d.ts`
- `server/auth/types.ts`
- `src/modules/tenant/iam/roles/role.types.ts`

## Key Files

| File | Symbols |
|------|---------|
| `prisma/generated/client/index.d.ts` | ProjectMemberUpdateManyAndReturnArgs, TaskCreateManyOrganizationInput, ProjectTeamCreateOrConnectWithoutRoleInput, CommentUncheckedCreateNestedManyWithoutTaskInput, ProjectUncheckedUpdateWithoutOrganizationInput, ... |
| `prisma/generated/client/runtime/client.d.ts` | InputJsonArray, InputJsonObject, InputJsonValue |
| `server/auth/types.ts` | AuthMeResponse, AuthOrgMembershipResponse, TenantRole |
| `src/modules/tenant/iam/roles/role.types.ts` | Client, Organization, AccessScope, Project |

## How to Explore

```
get_communities with id: "community-74"
smart_context with task: "understand generated/client +3 dirs", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
