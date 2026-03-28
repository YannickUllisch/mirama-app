import type { AppContext } from '@/server/shared/infrastructure/types'
import { OrganizationRepository } from '../../infrastructure/organization.repo'

export const GetOrganizationsQuery =
  ({ db, logger }: AppContext) =>
  async () => {
    logger.info('Fetching all organizations for the current tenant')

    const repo = OrganizationRepository(db)
    return await repo.getAll()
  }
