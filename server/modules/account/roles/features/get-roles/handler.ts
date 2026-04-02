import type { AppContext } from '@/server/shared/infrastructure/types'
import { RoleRepository } from '../../infrastructure/role.repo'
import { toRoleResponse } from '../response'

export const GetRolesQuery =
  ({ db }: AppContext) =>
  async () => {
    const repo = RoleRepository(db)
    const roles = await repo.getAll()
    return roles.map(toRoleResponse)
  }
