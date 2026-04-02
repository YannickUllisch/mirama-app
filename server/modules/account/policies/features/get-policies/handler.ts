import { toPolicyResponse } from '@/server/modules/account/roles/features/response'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { PolicyRepository } from '../../infrastructure/policy.repo'

export const GetPoliciesQuery =
  ({ db }: AppContext) =>
  async () => {
    const repo = PolicyRepository(db)
    const policies = await repo.getAll()
    return policies.map(toPolicyResponse)
  }
