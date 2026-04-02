'use client'

import type { UpdatePolicyRequest } from '@/server/modules/account/policies/features/update-policy/schema'
import type { PolicyResponse } from '@/server/modules/account/roles/features/response'
import apiRequest from '@hooks/query'
import { Badge } from '@ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { FileText, Network, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { EditPolicyDialog } from './dialogs/EditPolicyDialog'
import { MemberAccessTab } from './tabs/MemberAccessTab'
import { PoliciesTab } from './tabs/PoliciesTab'
import { RolesTab } from './tabs/RolesTab'
import type { IamScope } from './types'

export const IamManager = ({
  scope = { type: 'tenant' },
}: {
  scope: IamScope
}) => {
  const { data: roles = [], isLoading: rolesLoading } =
    apiRequest.role.fetchAll.useQuery()
  const { data: policies = [], isLoading: policiesLoading } =
    apiRequest.policy.fetchAll.useQuery()
  const { data: organizations = [] } =
    apiRequest.organization.fetchAll.useQuery()

  const { mutate: createRole } = apiRequest.role.create.useMutation()
  const { mutate: deleteRole } = apiRequest.role.delete.useMutation()
  const { mutate: attachPolicy } = apiRequest.role.attachPolicy.useMutation()
  const { mutate: detachPolicy } = apiRequest.role.detachPolicy.useMutation()
  const { mutate: createPolicy } = apiRequest.policy.create.useMutation()
  const { mutate: updatePolicy } = apiRequest.policy.update.useMutation()
  const { mutate: deletePolicy } = apiRequest.policy.delete.useMutation()

  const [selectedOrgId, setSelectedOrgId] = useState(
    scope.type === 'project' ? scope.organizationId : '',
  )
  const [selectedProjectId, setSelectedProjectId] = useState(
    scope.type === 'project' ? scope.projectId : '',
  )

  // ── Inline edit-policy state (shared between RolesTab and PoliciesTab) ────
  const [editingPolicy, setEditingPolicy] = useState<PolicyResponse | null>(
    null,
  )

  const handleUpdatePolicy = (id: string, data: UpdatePolicyRequest) => {
    updatePolicy({ id, data })
    setEditingPolicy(null)
  }

  // Project mode: render a focused single-section view
  if (scope.type === 'project') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {scope.organizationName ?? 'Organization'}
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-sm font-semibold">
            {scope.projectName ?? 'Project'}
          </span>
        </div>

        <MemberAccessTab
          scope={scope}
          roles={roles}
          organizations={organizations}
          selectedOrgId={selectedOrgId}
          selectedProjectId={selectedProjectId}
          onOrgChange={setSelectedOrgId}
          onProjectChange={setSelectedProjectId}
        />

        <EditPolicyDialog
          policy={editingPolicy}
          open={!!editingPolicy}
          onOpenChange={(open) => !open && setEditingPolicy(null)}
          onSubmit={handleUpdatePolicy}
        />
      </div>
    )
  }

  // Tenant view
  return (
    <div>
      <Tabs defaultValue="roles" className="space-y-5">
        <TabsList className="h-9">
          <TabsTrigger value="roles" className="text-xs gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Roles
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 ml-0.5"
            >
              {roles.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="policies" className="text-xs gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Policies
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 ml-0.5"
            >
              {policies.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="access" className="text-xs gap-1.5">
            <Network className="w-3.5 h-3.5" />
            Member Access
          </TabsTrigger>
        </TabsList>

        {/* ── Roles ── */}
        <TabsContent value="roles" className="mt-0">
          <RolesTab
            roles={roles}
            policies={policies}
            isLoading={rolesLoading}
            onCreateRole={createRole}
            onDeleteRole={deleteRole}
            onAttachPolicy={(roleId, policyId) =>
              attachPolicy({ roleId, policyId })
            }
            onDetachPolicy={(roleId, policyId) =>
              detachPolicy({ roleId, policyId })
            }
            onEditPolicy={setEditingPolicy}
          />
        </TabsContent>

        {/* ── Policies ── */}
        <TabsContent value="policies" className="mt-0">
          <PoliciesTab
            policies={policies}
            isLoading={policiesLoading}
            onCreatePolicy={createPolicy}
            onUpdatePolicy={handleUpdatePolicy}
            onDeletePolicy={deletePolicy}
          />
        </TabsContent>

        {/* ── Member Access ── */}
        <TabsContent value="access" className="mt-0">
          <MemberAccessTab
            scope={scope}
            roles={roles}
            organizations={organizations}
            selectedOrgId={selectedOrgId}
            selectedProjectId={selectedProjectId}
            onOrgChange={setSelectedOrgId}
            onProjectChange={setSelectedProjectId}
          />
        </TabsContent>
      </Tabs>

      <EditPolicyDialog
        policy={editingPolicy}
        open={!!editingPolicy}
        onOpenChange={(open) => !open && setEditingPolicy(null)}
        onSubmit={handleUpdatePolicy}
      />
    </div>
  )
}
