import { toPolicyResponse } from '@/server/modules/account/roles/features/response'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { PolicyRepository } from '../../infrastructure/policy.repo'
import type { CreatePolicyRequest } from './schema'

export const CreatePolicyCommand =
  ({ db, logger }: AppContext) =>
  async (input: CreatePolicyRequest) => {
    logger.info('Creating policy')
    const repo = PolicyRepository(db)
    const policy = await repo.create(input)
    return toPolicyResponse(policy)
  }
