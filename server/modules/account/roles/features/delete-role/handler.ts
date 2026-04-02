import type { AppContext } from '@/server/shared/infrastructure/types'
import { RoleRepository } from '../../infrastructure/role.repo'

export const DeleteRoleCommand =
  ({ db, logger }: AppContext) =>
  async (roleId: string) => {
    logger.info({ roleId }, 'Deleting role')
    const repo = RoleRepository(db)
    const role = await repo.findById(roleId)
    if (!role) throw new Error('Role not found')
    if (!role.tenantId) throw new Error('Cannot delete system roles')

    await repo.remove(roleId)
  }
