import type { PlanResponse } from '@src/modules/tenant/tenant/tenant.types'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import { useQuery } from '@tanstack/react-query'
import {
  fetchBillingUsageFn,
  fetchPlanByIdFn,
  fetchPlansFn,
} from './billing.api'
import type { BillingUsage } from './billing.types'

export const billingKeys = {
  root: ['billing'] as const,
  tenant: (tenantId: string) => [...billingKeys.root, tenantId] as const,
  usage: (tenantId: string) =>
    [...billingKeys.tenant(tenantId), 'usage'] as const,
  plans: (tenantId: string) =>
    [...billingKeys.tenant(tenantId), 'plans'] as const,
  plan: (tenantId: string, planId: string) =>
    [...billingKeys.plans(tenantId), planId] as const,
}

const billing = {
  fetchUsage: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<BillingUsage>({
        queryKey: billingKeys.usage(activeTenantId),
        queryFn: () => fetchBillingUsageFn(activeTenantId),
        enabled: !!activeTenantId,
      })
    },
  },

  plans: {
    fetchAll: {
      useQuery: () => {
        const { activeTenantId } = useTenantResource()
        return useQuery<PlanResponse[]>({
          queryKey: billingKeys.plans(activeTenantId),
          queryFn: () => fetchPlansFn(activeTenantId),
          enabled: !!activeTenantId,
        })
      },
    },

    fetchById: {
      useQuery: (planId: string) => {
        const { activeTenantId } = useTenantResource()
        return useQuery<PlanResponse>({
          queryKey: billingKeys.plan(activeTenantId, planId),
          queryFn: () => fetchPlanByIdFn(activeTenantId, planId),
          enabled: !!activeTenantId && !!planId,
        })
      },
    },
  },
}

export default billing
