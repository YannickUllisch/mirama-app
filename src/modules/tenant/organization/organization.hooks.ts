import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createOrganizationFn,
  deleteOrganizationFn,
  fetchOrganizationByIdFn,
  fetchOrganizationsFn,
  updateOrganizationFn,
} from './organization.api'
import type {
  CreateOrganizationCommand,
  OrganizationResponse,
  UpdateOrganizationCommand,
} from './organization.types'
import { useOrganizationResource } from './organizationResourceContext'

export const organizationKeys = {
  root: ['organizations'] as const,
  tenant: (tenantId: string) => [...organizationKeys.root, tenantId] as const,
  list: (tenantId: string) =>
    [...organizationKeys.tenant(tenantId), 'list'] as const,
  detail: (tenantId: string, orgId: string) =>
    [...organizationKeys.tenant(tenantId), 'detail', orgId] as const,
}

const organization = {
  fetchAll: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<OrganizationResponse[]>({
        queryKey: organizationKeys.list(activeTenantId),
        queryFn: () => fetchOrganizationsFn(activeTenantId),
      })
    },
  },

  fetchByCurrentScope: {
    useQuery: () => {
      const { activeOrganizationId, activeTenantId } = useOrganizationResource()
      return useQuery<OrganizationResponse>({
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
        CreateOrganizationCommand,
        { previous?: OrganizationResponse[] }
      >({
        mutationFn: (data) => createOrganizationFn(activeTenantId, data),
        ...optimisticList<OrganizationResponse, CreateOrganizationCommand>(
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

      type Vars = { id: string; data: UpdateOrganizationCommand }

      return useMutation<
        OrganizationResponse,
        Error,
        Vars,
        { previous?: OrganizationResponse[] }
      >({
        mutationFn: ({ id, data }) =>
          updateOrganizationFn(id, activeTenantId, data),
        ...optimisticList<OrganizationResponse, Vars>(
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

  delete: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<
        void,
        Error,
        string,
        { previous?: OrganizationResponse[] }
      >({
        mutationFn: (id) => deleteOrganizationFn(activeTenantId, id),
        ...optimisticList<OrganizationResponse, string>(
          queryClient,
          organizationKeys.list(activeTenantId),
          {
            invalidateKey: organizationKeys.tenant(activeTenantId),
            successMessage: 'Organization deleted',
            apply: (old, id) => old.filter((org) => org.id !== id),
          },
        ),
      })
    },
  },
}

export default organization
