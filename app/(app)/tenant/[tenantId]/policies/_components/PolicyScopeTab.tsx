// app/(app)/tenant/[tenantId]/policies/_components/PolicyScopeTab.tsx
'use client'

import { DataTable } from '@src/components/Tables/DataTable'
import { cn } from '@src/lib/utils'
import policyHooks from '@src/modules/tenant/iam/policy/policy.hooks'
import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policy.types'
import type { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import { Button } from '@ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type PolicyTableData, usePolicyColumns } from './PolicyColumns'
import { SCOPE_VISUALS } from './scopeConfig'

export const PolicyScopeTab = ({ scope }: { scope: AccessScope }) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()
  const { icon: Icon, label, accentClass, dotClass } = SCOPE_VISUALS[scope]

  const { items, serverPagination, isLoading } =
    policyHooks.fetchAll.useQuery(scope)
  const { mutate: deletePolicy } = policyHooks.delete.useMutation()

  const handleEditPolicy = (policy: PolicyResponse) => {
    router.push(`/tenant/${activeTenantId}/policies/${policy.id}/edit`)
  }

  const columns = usePolicyColumns({
    onEditPolicy: handleEditPolicy,
    onDeletePolicy: deletePolicy,
  })

  return (
    <div className="space-y-3">
      {/* Scope header */}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
            accentClass,
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass)} />
          <Icon className="w-3 h-3" />
          {label} policies
        </span>
      </div>

      <DataTable<PolicyTableData>
        tableIdentifier={`iam-policies-${scope}`}
        columns={columns}
        data={items as PolicyTableData[]}
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
                router.push(
                  `/tenant/${activeTenantId}/policies/create?defaultScope=${scope}`,
                )
              }
            >
              <Plus className="w-3.5 h-3.5" />
              New policy
            </Button>
          ),
        }}
        footerOptions={{ showPagination: true }}
      />
    </div>
  )
}
