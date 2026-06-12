// app/(app)/tenant/[tenantId]/roles/_components/RolesScopeTab.tsx
'use client'

import { DataTable } from '@src/components/Tables/DataTable'
import roleHooks from '@src/modules/tenant/iam/roles/hooks/role.hooks'
import type { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { CreateRoleDialog } from './CreateRoleDialog'
import { type RoleTableData, useRoleColumns } from './RoleColumns'

export const RolesScopeTab = ({ scope }: { scope: AccessScope }) => {
  const { items, serverPagination, isLoading } =
    roleHooks.fetchByScopeWithPolicies.useQuery(scope)

  const { mutate: createRole } = roleHooks.create.useMutation()
  const { mutate: deleteRole } = roleHooks.delete.useMutation()

  const columns = useRoleColumns({ onDelete: (id) => deleteRole(id) })

  return (
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
          <CreateRoleDialog
            defaultScope={scope}
            onSubmit={(data) => createRole(data)}
          />
        ),
      }}
      footerOptions={{ showPagination: true }}
    />
  )
}
