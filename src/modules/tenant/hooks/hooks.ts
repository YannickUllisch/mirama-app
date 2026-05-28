// src/modules/tenant/settings/hooks/hooks.ts
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchTenantSettingsFn, updateTenantSettingsFn } from './api'
import type { TenantResponse, UpdateTenantSettingsRequest } from './types'

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

  update: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const qc = useQueryClient()
      const key = tenantSettingsKeys.tenant(activeTenantId)

      return useMutation<TenantResponse, Error, UpdateTenantSettingsRequest>({
        mutationFn: (data) => updateTenantSettingsFn(activeTenantId, data),
        onMutate: async (vars) => {
          await qc.cancelQueries({ queryKey: key })
          const previous = qc.getQueryData<TenantResponse>(key)
          if (previous) {
            qc.setQueryData<TenantResponse>(key, (old) =>
              old ? { ...old, settings: { ...old.settings, ...vars } } : old,
            )
          }
          return { previous }
        },
        onSuccess: () => {
          toast.success('Settings updated')
        },
        onError: (err, _vars, ctx) => {
          const context = ctx as { previous?: TenantResponse } | undefined
          if (context?.previous) {
            qc.setQueryData(key, context.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          qc.invalidateQueries({ queryKey: key })
        },
      })
    },
  },
}

export default tenant
