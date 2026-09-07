// app/(app)/organization/[organizationSlug]/settings/roles/_components/RolesScopeTab.tsx
'use client'

import { DataTable } from '@src/components/Tables/DataTable'
import { cn } from '@src/lib/utils'
import roleHooks from '@src/modules/tenant/iam/roles/role.hooks'
import type { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { SCOPE_VISUALS } from '@src/modules/tenant/iam/scopeConfig'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { Button } from '@ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type RoleTableData, useRoleColumns } from './RoleColumns'

export const RolesScopeTab = ({ scope }: { scope: AccessScope }) => {
  const router = useRouter()
  const { activeOrganizationSlug } = useOrganizationResource()
  const { icon: Icon, label, accentClass, dotClass } = SCOPE_VISUALS[scope]

  const { items, serverPagination, isLoading } =
    roleHooks.fetchByScopeWithPolicies.useQuery(scope)
  const { mutate: deleteRole } = roleHooks.delete.useMutation()

  const rolesBase = `/organization/${activeOrganizationSlug}/settings/roles`

  const columns = useRoleColumns({
    onDelete: (id) => deleteRole(id),
    onEdit: (role) => router.push(`${rolesBase}/${role.id}/edit`),
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
            accentClass,
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass)} />
          <Icon className="w-3 h-3" />
          {label} roles
        </span>
      </div>

      <DataTable<RoleTableData>
        tableIdentifier={`iam-roles-${scope}`}
        columns={columns}
        data={items as RoleTableData[]}
        dataLoading={isLoading}
        serverPagination={serverPagination}
        ignoreSubrows
        toolbarOptions={{
          showFilterOption: true,
          addToolbarright: (
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                router.push(`${rolesBase}/create?defaultScope=${scope}`)
              }
            >
              <Plus className="w-3.5 h-3.5" />
              New role
            </Button>
          ),
        }}
        footerOptions={{ showPagination: true }}
      />
    </div>
  )
}
