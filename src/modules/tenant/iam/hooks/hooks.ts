// src/modules/tenant/iam/hooks/hooks.ts
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { useQuery } from '@tanstack/react-query'
import type { AvailablePermissionsResponse } from '../types'
import { fetchAvailablePermissionsFn } from './api'

export const iamKeys = {
  root: ['iam'] as const,
  tenant: (tenantId: string) => [...iamKeys.root, tenantId] as const,
  availablePermissions: (tenantId: string) =>
    [...iamKeys.tenant(tenantId), 'available-permissions'] as const,
}

const iam = {
  availablePermissions: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<AvailablePermissionsResponse>({
        queryKey: iamKeys.availablePermissions(activeTenantId),
        queryFn: () => fetchAvailablePermissionsFn(activeTenantId),
        staleTime: Number.POSITIVE_INFINITY,
      })
    },
  },
}

export default iam
