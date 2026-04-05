import type { AccessScope } from '@/prisma/generated/client'
import type { PolicyResponse } from '@server/modules/account/policies/features/response'
import { DataTable } from '@src/components/Tables/DataTable'
import { Building2, FileText, FolderKanban, Loader2 } from 'lucide-react'
import { SectionHeader } from '../SectionHeader'
import {
  type PolicyTableData,
  usePolicyColumns,
} from '../columns/PolicyColumns'

type Props = {
  policies: PolicyResponse[]
  isLoading: boolean
  onNewPolicy: (scope: AccessScope) => void
  onEditPolicy: (policy: PolicyResponse) => void
  onDeletePolicy: (id: string) => void
}

const EmptySection = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground/60 py-3 border border-dashed border-border rounded-xl px-4">
    <FileText className="w-3.5 h-3.5 shrink-0" />
    {label}
  </div>
)

export const PoliciesTab = ({
  policies,
  isLoading,
  onNewPolicy,
  onEditPolicy,
  onDeletePolicy,
}: Props) => {
  const columns = usePolicyColumns({ onEditPolicy, onDeletePolicy })

  const orgPolicies: PolicyTableData[] = policies.filter(
    (p) => p.scope !== 'PROJECT',
  )
  const projectPolicies: PolicyTableData[] = policies.filter(
    (p) => p.scope === 'PROJECT',
  )

  if (isLoading) {
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
          onNew={() => onNewPolicy('ORGANIZATION')}
        />
        {orgPolicies.length > 0 ? (
          <DataTable
            tableIdentifier="iam-org-policies"
            columns={columns}
            data={orgPolicies}
            ignoreSubrows
            toolbarOptions={{
              showFilterOption: true,
            }}
            footerOptions={{
              showPagination: orgPolicies.length > 10,
            }}
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
          onNew={() => onNewPolicy('PROJECT')}
        />
        {projectPolicies.length > 0 ? (
          <DataTable
            tableIdentifier="iam-project-policies"
            columns={columns}
            data={projectPolicies}
            ignoreSubrows
            toolbarOptions={{
              showFilterOption: false,
            }}
            footerOptions={{
              showPagination: projectPolicies.length > 10,
            }}
          />
        ) : (
          <EmptySection label="No project policies yet." />
        )}
      </div>
    </div>
  )
}
