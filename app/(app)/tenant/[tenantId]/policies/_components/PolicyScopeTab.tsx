// app/(app)/tenant/[tenantId]/policies/_components/PolicyScopeTab.tsx
'use client'

import { DataTable } from '@src/components/data-table/data-table'
import { DataTableSkeleton } from '@src/components/data-table/data-table-skeleton'
import { DataTableToolbar } from '@src/components/data-table/data-table-toolbar'
import { cn } from '@src/lib/utils'
import policyHooks from '@src/modules/tenant/iam/policy/policy.hooks'
import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policy.types'
import type { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePolicyColumns } from './PolicyColumns'
import { SCOPE_VISUALS } from './scopeConfig'

export const PolicyScopeTab = ({ scope }: { scope: AccessScope }) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()
  const { icon: Icon, label, accentClass, dotClass } = SCOPE_VISUALS[scope]

  const { mutate: deletePolicy } = policyHooks.delete.useMutation()

  const columns = usePolicyColumns({
    onEditPolicy: (policy) =>
      router.push(`/tenant/${activeTenantId}/policies/${policy.id}/edit`),
    onDeletePolicy: deletePolicy,
  })

  const { table, query } = policyHooks.fetchServerTable.useQuery(
    scope,
    columns as ColumnDef<PolicyResponse>[],
  )

  if (query.isLoading && !query.data) {
    return (
      <DataTableSkeleton
        columnCount={6}
        rowCount={8}
        filterCount={2}
        withViewOptions
        withPagination
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            accentClass,
          )}
        >
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotClass)} />
          <Icon className="h-3 w-3" />
          {label} policies
        </span>
      </div>

      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              router.push(
                `/tenant/${activeTenantId}/policies/create?defaultScope=${scope}`,
              )
            }
          >
            <Plus className="h-3.5 w-3.5" />
            New policy
          </Button>
        </DataTableToolbar>
      </DataTable>
    </div>
  )
}
