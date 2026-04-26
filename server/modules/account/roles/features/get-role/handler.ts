import type { AppContext } from '@/server/shared/infrastructure/types'
import { RoleRepository } from '../../infrastructure/role.repo'
import { toRoleResponse } from '../response'

export const GetRoleByIdQuery =
  ({ db }: AppContext) =>
  async (roleId: string) => {
    const repo = RoleRepository(db)
    const role = await repo.findById(roleId)

    if (!role) throw new Error('Role not found')

    return toRoleResponse(role)
  }
