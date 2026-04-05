import type { BillingResponse } from '@/server/modules/billing/features/response'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useQuery } from '@tanstack/react-query'
import { fetchBillingFn } from './api'

export const billingKeys = {
  root: ['billing'] as const,
  tenant: (tenantId: string) => [...billingKeys.root, tenantId] as const,
}

const billing = {
  fetchOverview: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<BillingResponse>({
        queryKey: billingKeys.tenant(activeTenantId),
        queryFn: () => fetchBillingFn(activeTenantId),
      })
    },
  },
}

export default billing
