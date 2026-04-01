import type { AppContext } from '@/server/shared/infrastructure/types'
import { OrganizationRepository } from '../../infrastructure/organization.repo'

export const GetOrganizationsQuery =
  ({ db }: AppContext) =>
  async () => {
    const repo = OrganizationRepository(db)
    return await repo.getAll()
  }
