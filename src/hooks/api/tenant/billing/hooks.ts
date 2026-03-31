import type { BillingResponse } from '@/server/modules/billing/features/response'
import { fetchBillingFn } from '@hooks/api/tenant/billing/api'
import { useTenantResource } from '@src/core/tenant/tenantResourceContext'
import { useQuery } from '@tanstack/react-query'

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
