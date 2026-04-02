import type { AppContext } from '@/server/shared/infrastructure/types'
import { RoleRepository } from '../../infrastructure/role.repo'
import { toRoleResponse } from '../response'
import type { CreateRoleRequest } from './schema'

export const CreateRoleCommand =
  ({ db, logger }: AppContext) =>
  async (input: CreateRoleRequest) => {
    logger.info('Creating role')
    const repo = RoleRepository(db)
    const role = await repo.create(input)
    return toRoleResponse(role)
  }
