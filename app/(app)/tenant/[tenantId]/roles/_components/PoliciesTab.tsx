// app/(app)/tenant/[tenantId]/roles/components/PoliciesTab.tsx
'use client'

import { DataTable } from '@src/components/Tables/DataTable'
import { SectionHeader } from '@src/modules/tenant/iam/components/SectionHeader'
import policyHooks from '@src/modules/tenant/iam/policy/hooks/hooks'
import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policyTypes'
import { AccessScope } from '@src/modules/tenant/iam/roles/roleTypes'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { Building2, FileText, FolderKanban, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type PolicyTableData, usePolicyColumns } from './PolicyColumns'

const EmptySection = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground/60 py-3 border border-dashed border-border rounded-xl px-4">
    <FileText className="w-3.5 h-3.5 shrink-0" />
    {label}
  </div>
)

export const PoliciesTab = () => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()

  const {
    items: orgPolicies,
    serverPagination: orgPagination,
    isLoading: orgLoading,
  } = policyHooks.fetchAll.useQuery(AccessScope.Organization)

  const {
    items: projectPolicies,
    serverPagination: projectPagination,
    isLoading: projectLoading,
  } = policyHooks.fetchAll.useQuery(AccessScope.Project)

  const { mutate: deletePolicy } = policyHooks.delete.useMutation()

  const handleEditPolicy = (policy: PolicyResponse) => {
    router.push(`/tenant/${activeTenantId}/roles/policy/${policy.id}/edit`)
  }

  const handleNewPolicy = (scope: AccessScope) => {
    router.push(
      `/tenant/${activeTenantId}/roles/policy/create?defaultScope=${scope}`,
    )
  }

  const columns = usePolicyColumns({
    onEditPolicy: handleEditPolicy,
    onDeletePolicy: deletePolicy,
  })

  if (orgLoading && projectLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionHeader
          icon={Building2}
          title="Organization Policies"
          description="Grant access across the entire organization. Can include org-level actions like managing members, teams, and invitations."
          color="coral"
          onNew={() => handleNewPolicy(AccessScope.Organization)}
        />
        {orgPolicies.length > 0 ? (
          <DataTable
            tableIdentifier="iam-org-policies"
            columns={columns}
            data={orgPolicies as PolicyTableData[]}
            serverPagination={orgPagination}
            ignoreSubrows
            toolbarOptions={{ showFilterOption: true }}
            footerOptions={{ showPagination: true }}
          />
        ) : (
          <EmptySection label="No organization policies yet." />
        )}
      </div>

      <div className="border-t border-border/60" />

      <div className="space-y-3">
        <SectionHeader
          icon={FolderKanban}
          title="Project Policies"
          description="Grant access within a specific project. Focused on project, task, milestone, and tag permissions. Union'd with org policies for effective access."
          color="forest"
          onNew={() => handleNewPolicy(AccessScope.Project)}
        />
        {projectPolicies.length > 0 ? (
          <DataTable
            tableIdentifier="iam-project-policies"
            columns={columns}
            data={projectPolicies as PolicyTableData[]}
            serverPagination={projectPagination}
            ignoreSubrows
            toolbarOptions={{ showFilterOption: false }}
            footerOptions={{ showPagination: true }}
          />
        ) : (
          <EmptySection label="No project policies yet." />
        )}
      </div>
    </div>
  )
}
