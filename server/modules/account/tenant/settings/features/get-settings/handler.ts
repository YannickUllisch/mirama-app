import type { AppContext } from '@/server/shared/infrastructure/types'
import { TenantSettingsRepository } from '../../infrastructure/tenant-settings.repo'
import { toTenantSettingsResponse } from '../response'

export const GetTenantSettingsQuery =
  ({ db }: AppContext) =>
  async (tenantId: string) => {
    const repo = TenantSettingsRepository(db)
    const settings = await repo.findByTenantId(tenantId)

    if (!settings) throw new Error('Tenant settings not found')

    return toTenantSettingsResponse(settings)
  }
