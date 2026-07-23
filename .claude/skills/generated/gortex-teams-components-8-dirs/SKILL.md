---
name: gortex-teams-components-8-dirs
description: "Work in the teams/_components +8 dirs area — 155 symbols across 21 files (80% cohesion)"
---

# teams/_components +8 dirs

155 symbols | 21 files | 80% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `app/(app)/organization/[organizationId]/(management)/teams/_components/AddTeamMemberDialog.tsx`
- `app/(app)/organization/[organizationId]/(management)/teams/_components/CreateTeamDialog.tsx`
- `app/(app)/organization/[organizationId]/(management)/teams/_components/TeamMemberColumns.tsx`
- `app/(app)/organization/[organizationId]/(management)/teams/_components/TeamSection.tsx`
- `app/(app)/organization/[organizationId]/(management)/teams/_components/TeamsContent.tsx`
- `app/(app)/organization/[organizationId]/(management)/teams/page.tsx`
- `server/auth/login.ts`
- `src/components/(application)/core/Avatar/UserCard.tsx`
- `src/components/Dialogs/AddMemberDialog.tsx`
- `src/components/Dialogs/AddMilestoneDialog.tsx`
- `src/components/Dialogs/AddTagDialog.tsx`
- `src/components/Dialogs/ConfirmationDialogWithOpenState.tsx`
- `src/components/Dialogs/EditUserDialog.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/SetPasswordForm.tsx`
- `src/components/auth/VerifyForm.tsx`
- `src/components/auth/popups/FormError.tsx`
- `src/components/auth/popups/FormSuccess.tsx`
- `src/components/ui/dialog.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | then |
| `app/(app)/organization/[organizationId]/(management)/teams/_components/AddTeamMemberDialog.tsx` | AddTeamMemberDialog, handleOpenChange, form, handleSubmit, noMembersLeft, ... |
| `app/(app)/organization/[organizationId]/(management)/teams/_components/CreateTeamDialog.tsx` | form, handleSubmit, CreateTeamDialog, handleOpenChange, open, ... |
| `app/(app)/organization/[organizationId]/(management)/teams/_components/TeamMemberColumns.tsx` | useTeamMemberColumns |
| `app/(app)/organization/[organizationId]/(management)/teams/_components/TeamSection.tsx` | handleRemove, TeamSection, color, showAddDialog, memberToRemove, ... |
| `app/(app)/organization/[organizationId]/(management)/teams/_components/TeamsContent.tsx` | isCreating, canDelete, setShowCreateDialog, orgMembers, showCreateDialog, ... |
| `app/(app)/organization/[organizationId]/(management)/teams/page.tsx` | TeamsPage |
| `server/auth/login.ts` | password, email, error, login, values, ... |
| `src/components/(application)/core/Avatar/UserCard.tsx` | editDialogOpen, setEditDialogOpen, deleteDialogOpen, UserCardProps, dropDownOpen, ... |
| `src/components/Dialogs/AddMemberDialog.tsx` | createInvitationMutate, setIsOpen, onSubmit, AddMemberDialog, isOpen, ... |
| `src/components/Dialogs/AddMilestoneDialog.tsx` | _vals, onSubmit, startTransition, setDatePopup, datePopup, ... |
| `src/components/Dialogs/AddTagDialog.tsx` | AddTagDialog, startTransition, createTagMutation, isPending, isCreatePending, ... |
| `src/components/Dialogs/ConfirmationDialogWithOpenState.tsx` | ConfirmationDialogWithOpenState |
| `src/components/Dialogs/EditUserDialog.tsx` | EditUserDialogProps, form, mutateUser, isPending, onSubmit, ... |
| `src/components/auth/LoginForm.tsx` | form, error, urlError, onSubmit, LoginForm, ... |
| `src/components/auth/RegisterForm.tsx` | setError, RegisterForm, isPending, router, onSubmit, ... |
| `src/components/auth/SetPasswordForm.tsx` | onSubmit, setSuccess, startTransition, success, SetPasswordForm, ... |
| `src/components/auth/VerifyForm.tsx` | error, vals, setError, onSubmit, handleResend, ... |
| `src/components/auth/popups/FormError.tsx` | FormError |
| `src/components/auth/popups/FormSuccess.tsx` | FormSuccess |
| `src/components/ui/dialog.tsx` | DialogHeader, DialogFooter |

## Connected Communities

- **components/ui +97 dirs** (7 cross-edges)
- **. +9 dirs** (3 cross-edges)
- **components/ui +23 dirs** (2 cross-edges)
- **auth · providers.authorize** (1 cross-edges)
- **components/ui +15 dirs** (1 cross-edges)
- **auth/cognito +1 dirs** (1 cross-edges)
- **auth · verify** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-194"
smart_context with task: "understand teams/_components +8 dirs", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
