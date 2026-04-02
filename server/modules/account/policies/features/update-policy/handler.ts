import { toPolicyResponse } from '@/server/modules/account/roles/features/response'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { PolicyRepository } from '../../infrastructure/policy.repo'
import type { UpdatePolicyRequest } from './schema'

export const UpdatePolicyCommand =
  ({ db, logger }: AppContext) =>
  async (policyId: string, input: UpdatePolicyRequest) => {
    logger.info({ policyId }, 'Updating policy')
    const repo = PolicyRepository(db)
    const policy = await repo.findById(policyId)
    if (!policy) throw new Error('Policy not found')
    if (policy.isManaged) throw new Error('Cannot modify managed policies')

    const updated = await repo.update(policyId, input)
    return toPolicyResponse(updated)
  }
