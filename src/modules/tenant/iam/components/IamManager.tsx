'use client'

import type { AccessScope } from '@/prisma/generated/client'
import apiRequest from '@hooks/query'
import type { PolicyResponse } from '@server/modules/account/policies/features/response'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { Badge } from '@ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { FileText, Network, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { IamScope } from '../types'
import { MemberAccessTab } from './tabs/MemberAccessTab'
import { PoliciesTab } from './tabs/PoliciesTab'
import { RolesTab } from './tabs/RolesTab'

export const IamManager = ({
  scope = { type: 'tenant' },
  defaultTab,
}: {
  scope: IamScope
  defaultTab?: string
}) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()

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
  const { mutate: deletePolicy } = apiRequest.policy.delete.useMutation()

  const [selectedOrgId, setSelectedOrgId] = useState(
    scope.type === 'project' ? scope.organizationId : '',
  )
  const [selectedProjectId, setSelectedProjectId] = useState(
    scope.type === 'project' ? scope.projectId : '',
  )

  const handleEditPolicy = (policy: PolicyResponse) => {
    router.push(`/tenant/${activeTenantId}/roles/policy/${policy.id}/edit`)
  }

  const handleNewPolicy = (policyScope: AccessScope) => {
    router.push(
      `/tenant/${activeTenantId}/roles/policy/create?defaultScope=${policyScope}`,
    )
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
      </div>
    )
  }

  // Tenant view
  return (
    <div>
      <Tabs defaultValue={defaultTab ?? 'roles'} className="space-y-5">
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
            onEditPolicy={handleEditPolicy}
          />
        </TabsContent>

        {/* ── Policies ── */}
        <TabsContent value="policies" className="mt-0">
          <PoliciesTab
            policies={policies}
            isLoading={policiesLoading}
            onNewPolicy={handleNewPolicy}
            onEditPolicy={handleEditPolicy}
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
    </div>
  )
}
