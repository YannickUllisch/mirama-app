// src/modules/tenant/iam/hooks/api.ts
import { api } from '@src/modules/shared/api'
import type { AvailablePermissionsResponse } from './iam.types'

export const fetchAvailablePermissionsFn = async (
  tenantId: string,
): Promise<AvailablePermissionsResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/available-permissions`)
  return data
}
