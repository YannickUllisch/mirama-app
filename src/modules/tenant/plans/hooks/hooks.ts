// src/modules/tenant/plans/hooks/hooks.ts
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useQuery } from '@tanstack/react-query'
import { fetchPlansFn } from './api'
import type { PlanResponse } from './types'

export const plansKeys = {
  root: ['plans'] as const,
  tenant: (tenantId: string) => [...plansKeys.root, tenantId] as const,
}

const plans = {
  fetch: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<PlanResponse[]>({
        queryKey: plansKeys.tenant(activeTenantId),
        queryFn: () => fetchPlansFn(activeTenantId),
      })
    },
  },
}

export default plans
