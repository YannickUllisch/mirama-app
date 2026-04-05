import type { AppContext } from '@/server/shared/infrastructure/types'
import { TenantSettingsRepository } from '../../infrastructure/tenant-settings.repo'
import { toTenantSettingsResponse } from '../response'
import type { UpdateTenantSettingsRequest } from './schema'

export const UpdateTenantSettingsCommand =
  ({ db, logger }: AppContext) =>
  async (tenantId: string, input: UpdateTenantSettingsRequest) => {
    logger.info({ tenantId }, 'Updating tenant settings')

    const repo = TenantSettingsRepository(db)
    const existing = await repo.findByTenantId(tenantId)

    if (!existing) {
      throw new Error('Tenant settings not found')
    }

    const updated = await repo.update(tenantId, input)

    return toTenantSettingsResponse(updated)
  }
