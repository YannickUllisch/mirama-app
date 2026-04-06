import type { AppContext } from '@/server/shared/infrastructure/types'

import { BillingRepository } from '../../infrastructure/billing.repo'
import type { PlanResponse } from '../response'

export const GetBillingQuery =
  ({ db }: AppContext) =>
  async (_tenantId: string): Promise<PlanResponse> => {
    const repo = BillingRepository(db)
    const _plans = await repo.getPlans()
  }
