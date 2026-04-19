import type { TenantSettingsResponse } from '@/server/modules/account/tenant/settings/features/response'
import type { UpdateTenantSettingsRequest } from '@/server/modules/account/tenant/settings/features/update-settings/schema'
import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTenantSettingsFn, updateTenantSettingsFn } from './api'

export const tenantSettingsKeys = {
  root: ['tenant-settings'] as const,
  tenant: (tenantId: string) => [...tenantSettingsKeys.root, tenantId] as const,
}

const tenantSettings = {
  fetch: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<TenantSettingsResponse>({
        queryKey: tenantSettingsKeys.tenant(activeTenantId),
        queryFn: () => fetchTenantSettingsFn(activeTenantId),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const qc = useQueryClient()
      const key = tenantSettingsKeys.tenant(activeTenantId)

      return useMutation<
        TenantSettingsResponse,
        Error,
        UpdateTenantSettingsRequest,
        any
      >({
        mutationFn: (data) => updateTenantSettingsFn(activeTenantId, data),
        ...optimisticList<TenantSettingsResponse, UpdateTenantSettingsRequest>(
          qc,
          key,
          {
            successMessage: 'Settings updated',
            apply: (old: any, vars) => ({ ...old, ...vars }),
          },
        ),
      })
    },
  },
}

export default tenantSettings
