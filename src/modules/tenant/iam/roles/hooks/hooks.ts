import type { CreateRoleRequest } from '@/server/modules/account/roles/features/create-role/schema'
import type { RoleResponse } from '@/server/modules/account/roles/features/response'
import type { UpdateRoleRequest } from '@/server/modules/account/roles/features/update-role/schema'
import { optimisticList } from '@hooks/query/helpers'
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  attachPolicyFn,
  createRoleFn,
  deleteRoleFn,
  detachPolicyFn,
  fetchRolesFn,
  updateRoleFn,
} from './api'

export const roleKeys = {
  root: ['roles'] as const,
  tenant: (tenantId: string) => [...roleKeys.root, tenantId] as const,
  list: (tenantId: string) => [...roleKeys.tenant(tenantId), 'list'] as const,
}

const role = {
  fetchAll: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<RoleResponse[]>({
        queryKey: roleKeys.list(activeTenantId),
        queryFn: () => fetchRolesFn(activeTenantId),
      })
    },
  },

  fetchAllOrganizationSpecific: {
    useQuery: () => {
      const { activeTenantId } = useOrganizationResource()
      return useQuery<RoleResponse[]>({
        queryKey: roleKeys.list(activeTenantId),
        queryFn: () => fetchRolesFn(activeTenantId),
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<
        RoleResponse,
        Error,
        CreateRoleRequest,
        { previous?: RoleResponse[] }
      >({
        mutationFn: (data) => createRoleFn(activeTenantId, data),
        ...optimisticList<RoleResponse, CreateRoleRequest>(
          queryClient,
          roleKeys.list(activeTenantId),
          {
            invalidateKey: roleKeys.tenant(activeTenantId),
            successMessage: 'Role created',
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      type Vars = { id: string; data: UpdateRoleRequest }

      return useMutation<
        RoleResponse,
        Error,
        Vars,
        { previous?: RoleResponse[] }
      >({
        mutationFn: ({ id, data }) => updateRoleFn(activeTenantId, id, data),
        ...optimisticList<RoleResponse, Vars>(
          queryClient,
          roleKeys.list(activeTenantId),
          {
            invalidateKey: roleKeys.tenant(activeTenantId),
            successMessage: 'Role updated',
            apply: (old, { id, data }) =>
              old.map((r) => (r.id === id ? { ...r, ...data } : r)),
          },
        ),
      })
    },
  },

  delete: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<void, Error, string, { previous?: RoleResponse[] }>({
        mutationFn: (roleId) => deleteRoleFn(activeTenantId, roleId),
        ...optimisticList<RoleResponse, string>(
          queryClient,
          roleKeys.list(activeTenantId),
          {
            invalidateKey: roleKeys.tenant(activeTenantId),
            successMessage: 'Role deleted',
            apply: (old, roleId) => old.filter((r) => r.id !== roleId),
          },
        ),
      })
    },
  },

  attachPolicy: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      type Vars = { roleId: string; policyId: string }

      return useMutation<
        RoleResponse,
        Error,
        Vars,
        { previous?: RoleResponse[] }
      >({
        mutationFn: ({ roleId, policyId }) =>
          attachPolicyFn(activeTenantId, roleId, policyId),
        ...optimisticList<RoleResponse, Vars>(
          queryClient,
          roleKeys.list(activeTenantId),
          {
            invalidateKey: roleKeys.tenant(activeTenantId),
            successMessage: 'Policy attached',
          },
        ),
      })
    },
  },

  detachPolicy: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      type Vars = { roleId: string; policyId: string }

      return useMutation<
        RoleResponse,
        Error,
        Vars,
        { previous?: RoleResponse[] }
      >({
        mutationFn: ({ roleId, policyId }) =>
          detachPolicyFn(activeTenantId, roleId, policyId),
        ...optimisticList<RoleResponse, Vars>(
          queryClient,
          roleKeys.list(activeTenantId),
          {
            invalidateKey: roleKeys.tenant(activeTenantId),
            successMessage: 'Policy detached',
          },
        ),
      })
    },
  },
}

export default role
