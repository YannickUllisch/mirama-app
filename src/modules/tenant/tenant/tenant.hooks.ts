import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import { useQuery } from '@tanstack/react-query'
import { fetchTenantSettingsFn } from './tenant.api'
import type { TenantResponse } from './tenant.types'

export const tenantSettingsKeys = {
  root: ['tenant'] as const,
  tenant: (tenantId: string) => [...tenantSettingsKeys.root, tenantId] as const,
}

const tenant = {
  fetch: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<TenantResponse>({
        queryKey: tenantSettingsKeys.tenant(activeTenantId),
        queryFn: () => fetchTenantSettingsFn(activeTenantId),
      })
    },
  },
}

export default tenant
