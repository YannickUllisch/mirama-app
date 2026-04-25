// app/(app)/tenant/[tenantId]/roles/components/RolesTab.tsx
import { AccessScope } from '@/prisma/generated/client'
import type { CreateRoleRequest } from '@/server/modules/account/roles/features/create-role/schema'
import type { PolicyResponse } from '@server/modules/account/policies/features/response'
import type { RoleResponse } from '@server/modules/account/roles/features/response'
import { Input } from '@ui/input'
import { Building2, FolderKanban, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { CreateRoleDialog } from './CreateRoleDialog'
import IamScopeSection from './IamScopeSection'

export const RolesTab = ({
  roles,
  policies,
  isLoading,
  onCreateRole,
  onDeleteRole,
  onAttachPolicy,
  onDetachPolicy,
  onEditPolicy,
}: {
  roles: RoleResponse[]
  policies: PolicyResponse[]
  isLoading: boolean
  onCreateRole: (data: CreateRoleRequest) => void
  onDeleteRole: (id: string) => void
  onAttachPolicy: (roleId: string, policyId: string) => void
  onDetachPolicy: (roleId: string, policyId: string) => void
  onEditPolicy: (policy: PolicyResponse) => void
}) => {
  const [search, setSearch] = useState('')

  const filtered = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const orgRoles = filtered.filter((r) => r.scope !== AccessScope.PROJECT)
  const projectRoles = filtered.filter((r) => r.scope === AccessScope.PROJECT)

  const orgPolicies = policies.filter((p) => p.scope !== AccessScope.PROJECT)
  const projectPolicies = policies.filter(
    (p) => p.scope === AccessScope.PROJECT,
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <CreateRoleDialog onSubmit={onCreateRole} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="space-y-6">
          <IamScopeSection
            icon={Building2}
            title="Organization Roles"
            description="Roles applied org-wide. Members with these roles can access resources across the entire organization based on their attached policies."
            roles={orgRoles}
            policies={orgPolicies}
            emptyLabel="No organization roles yet. Create one to get started."
            onAttachPolicy={onAttachPolicy}
            onDetachPolicy={onDetachPolicy}
            onDeleteRole={onDeleteRole}
            onEditPolicy={onEditPolicy}
          />

          <div className="border-t border-border/60" />

          <IamScopeSection
            icon={FolderKanban}
            title="Project Roles"
            description="Roles applied to specific projects. Policies here control access within a single project and are union'd with org-level permissions for the effective access set."
            roles={projectRoles}
            policies={projectPolicies}
            emptyLabel="No project roles yet. These are assigned per-project to project members."
            onAttachPolicy={onAttachPolicy}
            onDetachPolicy={onDetachPolicy}
            onDeleteRole={onDeleteRole}
            onEditPolicy={onEditPolicy}
          />
        </div>
      )}
    </div>
  )
}
