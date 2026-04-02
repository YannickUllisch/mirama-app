import type { AppContext } from '@/server/shared/infrastructure/types'
import { PolicyRepository } from '../../infrastructure/policy.repo'

export const DeletePolicyCommand =
  ({ db, logger }: AppContext) =>
  async (policyId: string) => {
    logger.info({ policyId }, 'Deleting policy')
    const repo = PolicyRepository(db)
    const policy = await repo.findById(policyId)
    if (!policy) throw new Error('Policy not found')
    if (policy.isManaged) throw new Error('Cannot delete managed policies')

    await repo.remove(policyId)
  }
