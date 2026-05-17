import {
  optimisticList,
  usePaginatedQuery,
} from '@src/modules/shared/hooks/helpers'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  AccessScope,
  CreateRoleCommand,
  RoleResponse,
  UpdateRoleCommand,
} from '../roleTypes'
import {
  attachPolicyFn,
  createRoleFn,
  deleteRoleFn,
  detachPolicyFn,
  fetchRoleByIdFn,
  fetchRolesFn,
  fetchRolesWithPoliciesFn,
  updateRoleFn,
} from './api'

export const roleKeys = {
  root: ['roles'] as const,
  tenant: (tenantId: string) => [...roleKeys.root, tenantId] as const,
  list: (tenantId: string) => [...roleKeys.tenant(tenantId), 'list'] as const,
  detail: (tenantId: string, roleId: string) =>
    [...roleKeys.tenant(tenantId), 'detail', roleId] as const,
}

const role = {
  fetchAllByScope: {
    useQuery: (scope: AccessScope) => {
      const { activeTenantId } = useTenantResource()
      return useQuery<RoleResponse[]>({
        queryKey: roleKeys.list(activeTenantId),
        queryFn: () => fetchRolesFn(activeTenantId, scope),
      })
    },
  },

  fetchByScopeWithPolicies: {
    useQuery: (scope: AccessScope) => {
      const { activeTenantId } = useTenantResource()
      return usePaginatedQuery(roleKeys.list(activeTenantId), (params) =>
        fetchRolesWithPoliciesFn(activeTenantId, scope, params),
      )
    },
  },

  fetchCurrentUserRole: {
    useQuery: (roleId: string) => {
      const { activeTenantId } = useOrganizationResource()

      return useQuery<RoleResponse>({
        queryKey: roleKeys.detail(activeTenantId, roleId),
        queryFn: () => fetchRoleByIdFn(activeTenantId, roleId),
        enabled: !!roleId && !!activeTenantId,
      })
    },
  },

  fetchAllByScopeForOrganization: {
    useQuery: (scope: AccessScope) => {
      const { activeTenantId } = useOrganizationResource()
      return useQuery<RoleResponse[]>({
        queryKey: roleKeys.list(activeTenantId),
        queryFn: () => fetchRolesFn(activeTenantId, scope),
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
        CreateRoleCommand,
        { previous?: RoleResponse[] }
      >({
        mutationFn: (data) => createRoleFn(activeTenantId, data),
        ...optimisticList<RoleResponse, CreateRoleCommand>(
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

      type Vars = { id: string; data: UpdateRoleCommand }

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
