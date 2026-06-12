import {
  optimisticList,
  usePaginatedQuery,
} from '@src/modules/shared/hooks/helpers'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AccessScope } from '../../roles/role.types'
import type {
  AddPolicyStatementCommand,
  CreatePolicyCommand,
  PolicyResponse,
  UpdatePolicyCommand,
} from '../policy.types'
import {
  addPolicyStatementFn,
  createPolicyFn,
  deletePolicyFn,
  fetchPoliciesFn,
  fetchPolicyByIdFn,
  removePolicyStatementFn,
  updatePolicyFn,
} from './policy.api'

export const policyKeys = {
  root: ['policies'] as const,
  tenant: (tenantId: string) => [...policyKeys.root, tenantId] as const,
  list: (tenantId: string) => [...policyKeys.tenant(tenantId), 'list'] as const,
  scopedList: (tenantId: string, scope: AccessScope) =>
    [...policyKeys.tenant(tenantId), 'list', scope] as const,
  detail: (tenantId: string, policyId: string) =>
    [...policyKeys.tenant(tenantId), policyId] as const,
}

const policy = {
  fetchById: {
    useQuery: (policyId: string) => {
      const { activeTenantId } = useTenantResource()
      return useQuery<PolicyResponse>({
        queryKey: policyKeys.detail(activeTenantId, policyId),
        queryFn: () => fetchPolicyByIdFn(activeTenantId, policyId),
        enabled: !!policyId,
      })
    },
  },

  fetchAll: {
    useQuery: (scope: AccessScope) => {
      const { activeTenantId } = useTenantResource()
      return usePaginatedQuery(
        policyKeys.scopedList(activeTenantId, scope),
        (params) => fetchPoliciesFn(activeTenantId, scope, params),
      )
    },
  },

  create: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<
        PolicyResponse,
        Error,
        CreatePolicyCommand,
        { previous?: PolicyResponse[] }
      >({
        mutationFn: (data) => createPolicyFn(activeTenantId, data),
        ...optimisticList<PolicyResponse, CreatePolicyCommand>(
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

      type Vars = { id: string; data: UpdatePolicyCommand }

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

  addStatement: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      type Vars = {
        policyId: string
        data: Omit<AddPolicyStatementCommand, 'policyId'>
      }

      return useMutation<
        PolicyResponse,
        Error,
        Vars,
        { previous?: PolicyResponse[] }
      >({
        mutationFn: ({ policyId, data }) =>
          addPolicyStatementFn(activeTenantId, policyId, data),
        ...optimisticList<PolicyResponse, Vars>(
          queryClient,
          policyKeys.list(activeTenantId),
          {
            invalidateKey: policyKeys.tenant(activeTenantId),
            successMessage: 'Statement added',
            apply: (old, { policyId, data }) =>
              old.map((p) =>
                p.id === policyId
                  ? {
                      ...p,
                      statements: [
                        ...p.statements,
                        {
                          id: crypto.randomUUID(),
                          action: data.action,
                          resource: data.resource ?? '*',
                          effect: data.effect ?? 'Allow',
                        },
                      ],
                    }
                  : p,
              ),
          },
        ),
      })
    },
  },

  removeStatement: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      type Vars = { policyId: string; statementId: string }

      return useMutation<void, Error, Vars, { previous?: PolicyResponse[] }>({
        mutationFn: ({ policyId, statementId }) =>
          removePolicyStatementFn(activeTenantId, policyId, statementId),
        ...optimisticList<PolicyResponse, Vars>(
          queryClient,
          policyKeys.list(activeTenantId),
          {
            invalidateKey: policyKeys.tenant(activeTenantId),
            successMessage: 'Statement removed',
            apply: (old, { policyId, statementId }) =>
              old.map((p) =>
                p.id === policyId
                  ? {
                      ...p,
                      statements: p.statements.filter(
                        (s) => s.id !== statementId,
                      ),
                    }
                  : p,
              ),
          },
        ),
      })
    },
  },
}

export default policy
