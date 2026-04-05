import type { CreateOrganizationRequest } from '@/server/modules/account/organizations/features/create-organization/schema'
import type {
  OrganizationListResponse,
  OrganizationResponse,
} from '@/server/modules/account/organizations/features/response'
import type { UpdateOrganizationRequest } from '@/server/modules/account/organizations/features/update-organization/schema'
import { optimisticList } from '@hooks/query/helpers'
import {
  createOrganizationFn,
  fetchOrganizationByIdFn,
  fetchOrganizationsFn,
  fetchOrgProjectsFn,
  updateOrganizationFn,
  type OrgProjectSummary,
} from '@src/modules/organization/hooks/api'
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const organizationKeys = {
  // ['organizations']
  root: ['organizations'] as const,
  // ['organizations', tenantId]
  tenant: (tenantId: string) => [...organizationKeys.root, tenantId] as const,
  // ['organizations', tenantId, 'list']
  list: (tenantId: string) =>
    [...organizationKeys.tenant(tenantId), 'list'] as const,
  // ['organizations', tenantId, 'detail', orgId]
  detail: (tenantId: string, orgId: string) =>
    [...organizationKeys.tenant(tenantId), 'detail', orgId] as const,
}

const organization = {
  fetchAll: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<OrganizationListResponse[]>({
        queryKey: organizationKeys.list(activeTenantId),
        queryFn: () => fetchOrganizationsFn(activeTenantId),
      })
    },
  },

  fetchByCurrentScope: {
    useQuery: () => {
      const { activeOrganizationId, activeTenantId } = useOrganizationResource()
      return useQuery<OrganizationListResponse>({
        queryKey: organizationKeys.detail(activeTenantId, activeOrganizationId),
        queryFn: () =>
          fetchOrganizationByIdFn(activeTenantId, activeOrganizationId),
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<
        OrganizationResponse,
        Error,
        CreateOrganizationRequest,
        { previous?: OrganizationListResponse[] }
      >({
        mutationFn: (data) => createOrganizationFn(activeTenantId, data),
        ...optimisticList<OrganizationListResponse, CreateOrganizationRequest>(
          queryClient,
          organizationKeys.list(activeTenantId),
          {
            invalidateKey: organizationKeys.tenant(activeTenantId),
            successMessage: 'Organization created',
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      type Vars = { id: string; data: UpdateOrganizationRequest }

      return useMutation<
        OrganizationResponse,
        Error,
        Vars,
        { previous?: OrganizationListResponse[] }
      >({
        mutationFn: ({ id, data }) =>
          updateOrganizationFn(id, activeTenantId, data),
        ...optimisticList<OrganizationListResponse, Vars>(
          queryClient,
          organizationKeys.list(activeTenantId),
          {
            invalidateKey: organizationKeys.tenant(activeTenantId),
            successMessage: 'Organization updated',
            apply: (old, { id, data }) =>
              old.map((org) => (org.id === id ? { ...org, ...data } : org)),
          },
        ),
      })
    },
  },
  fetchProjectsByOrg: {
    useQuery: (organizationId: string) =>
      useQuery<OrgProjectSummary[]>({
        queryKey: ['orgProjects', organizationId],
        queryFn: () => fetchOrgProjectsFn(organizationId),
        enabled: !!organizationId,
      }),
  },
}

export default organization
