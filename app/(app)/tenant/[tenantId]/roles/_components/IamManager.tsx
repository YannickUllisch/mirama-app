// app/(app)/tenant/[tenantId]/roles/components/IamManager.tsx
'use client'

import type { AccessScope } from '@/prisma/generated/client'
import apiRequest from '@hooks/query'
import type { PolicyResponse } from '@server/modules/account/policies/features/response'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { Badge } from '@ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { FileText, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PoliciesTab } from './PoliciesTab'
import { RolesTab } from './RolesTab'

export const IamManager = ({ defaultTab }: { defaultTab?: string }) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()

  const { data: roles = [], isLoading: rolesLoading } =
    apiRequest.role.fetchAll.useQuery()
  const { data: policies = [], isLoading: policiesLoading } =
    apiRequest.policy.fetchAll.useQuery()

  const { mutate: createRole } = apiRequest.role.create.useMutation()
  const { mutate: deleteRole } = apiRequest.role.delete.useMutation()
  const { mutate: attachPolicy } = apiRequest.role.attachPolicy.useMutation()
  const { mutate: detachPolicy } = apiRequest.role.detachPolicy.useMutation()
  const { mutate: deletePolicy } = apiRequest.policy.delete.useMutation()

  const handleEditPolicy = (policy: PolicyResponse) => {
    router.push(`/tenant/${activeTenantId}/roles/policy/${policy.id}/edit`)
  }

  const handleNewPolicy = (policyScope: AccessScope) => {
    router.push(
      `/tenant/${activeTenantId}/roles/policy/create?defaultScope=${policyScope}`,
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
        </TabsList>

        <TabsContent value="roles" className="mt-0">
          <RolesTab
            roles={roles}
            policies={policies}
            isLoading={rolesLoading}
            onCreateRole={createRole}
            onDeleteRole={deleteRole}
            onAttachPolicy={(roleId: string, policyId: string) =>
              attachPolicy({ roleId, policyId })
            }
            onDetachPolicy={(roleId: string, policyId: string) =>
              detachPolicy({ roleId, policyId })
            }
            onEditPolicy={handleEditPolicy}
          />
        </TabsContent>

        <TabsContent value="policies" className="mt-0">
          <PoliciesTab
            policies={policies}
            isLoading={policiesLoading}
            onNewPolicy={handleNewPolicy}
            onEditPolicy={handleEditPolicy}
            onDeletePolicy={deletePolicy}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
