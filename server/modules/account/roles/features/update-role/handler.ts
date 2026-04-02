import type { AppContext } from '@/server/shared/infrastructure/types'
import { RoleRepository } from '../../infrastructure/role.repo'
import { toRoleResponse } from '../response'
import type { UpdateRoleRequest } from './schema'

export const UpdateRoleCommand =
  ({ db, logger }: AppContext) =>
  async (roleId: string, input: UpdateRoleRequest) => {
    logger.info({ roleId }, 'Updating role')
    const repo = RoleRepository(db)
    const role = await repo.findById(roleId)
    if (!role) throw new Error('Role not found')
    if (!role.tenantId) throw new Error('Cannot modify system roles')

    const updated = await repo.update(roleId, input)
    return toRoleResponse(updated)
  }

export const AttachPolicyCommand =
  ({ db, logger }: AppContext) =>
  async (roleId: string, policyId: string) => {
    logger.info({ roleId, policyId }, 'Attaching policy to role')
    const repo = RoleRepository(db)
    const role = await repo.findById(roleId)
    if (!role) throw new Error('Role not found')

    const updated = await repo.attachPolicy(roleId, policyId)
    return toRoleResponse(updated)
  }

export const DetachPolicyCommand =
  ({ db, logger }: AppContext) =>
  async (roleId: string, policyId: string) => {
    logger.info({ roleId, policyId }, 'Detaching policy from role')
    const repo = RoleRepository(db)
    const role = await repo.findById(roleId)
    if (!role) throw new Error('Role not found')

    const updated = await repo.detachPolicy(roleId, policyId)
    return toRoleResponse(updated)
  }
