import type { CreatePolicyRequest } from '@/server/modules/account/policies/features/create-policy/schema'
import type { UpdatePolicyRequest } from '@/server/modules/account/policies/features/update-policy/schema'
import type { PolicyResponse } from '@/server/modules/account/roles/features/response'
import {
  createPolicyFn,
  deletePolicyFn,
  fetchPoliciesFn,
  updatePolicyFn,
} from '@hooks/api/policy/api'
import { optimisticList } from '@hooks/query/helpers'
import { useTenantResource } from '@src/core/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const policyKeys = {
  root: ['policies'] as const,
  tenant: (tenantId: string) => [...policyKeys.root, tenantId] as const,
  list: (tenantId: string) => [...policyKeys.tenant(tenantId), 'list'] as const,
}

const policy = {
  fetchAll: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<PolicyResponse[]>({
        queryKey: policyKeys.list(activeTenantId),
        queryFn: () => fetchPoliciesFn(activeTenantId),
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<
        PolicyResponse,
        Error,
        CreatePolicyRequest,
        { previous?: PolicyResponse[] }
      >({
        mutationFn: (data) => createPolicyFn(activeTenantId, data),
        ...optimisticList<PolicyResponse, CreatePolicyRequest>(
          queryClient,
          policyKeys.list(activeTenantId),
          {
            invalidateKey: policyKeys.tenant(activeTenantId),
            successMessage: 'Policy created',
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      type Vars = { id: string; data: UpdatePolicyRequest }

      return useMutation<
        PolicyResponse,
        Error,
        Vars,
        { previous?: PolicyResponse[] }
      >({
        mutationFn: ({ id, data }) => updatePolicyFn(activeTenantId, id, data),
        ...optimisticList<PolicyResponse, Vars>(
          queryClient,
          policyKeys.list(activeTenantId),
          {
            invalidateKey: policyKeys.tenant(activeTenantId),
            successMessage: 'Policy updated',
            apply: (old, { id, data }) =>
              old.map((p) =>
                p.id === id ? ({ ...p, ...data } as PolicyResponse) : p,
              ),
          },
        ),
      })
    },
  },

  delete: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<void, Error, string, { previous?: PolicyResponse[] }>({
        mutationFn: (policyId) => deletePolicyFn(activeTenantId, policyId),
        ...optimisticList<PolicyResponse, string>(
          queryClient,
          policyKeys.list(activeTenantId),
          {
            invalidateKey: policyKeys.tenant(activeTenantId),
            successMessage: 'Policy deleted',
            apply: (old, policyId) => old.filter((p) => p.id !== policyId),
          },
        ),
      })
    },
  },
}

export default policy
