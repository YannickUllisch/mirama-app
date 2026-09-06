// app/(app)/organization/[organizationSlug]/settings/roles/[roleId]/edit/_components/EditRoleView.tsx
'use client'

import { RoleForm } from '@src/modules/tenant/iam/roles/components/RoleForm'
import roleHooks from '@src/modules/tenant/iam/roles/role.hooks'
import { Loader2 } from 'lucide-react'

export const EditRoleView = ({ roleId }: { roleId: string }) => {
  const { data: role, isLoading } =
    roleHooks.fetchByIdForTenant.useQuery(roleId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!role) {
    return (
      <div className="text-center py-24 text-muted-foreground text-sm">
        Role not found.
      </div>
    )
  }

  return <RoleForm defaultRole={role} />
}
