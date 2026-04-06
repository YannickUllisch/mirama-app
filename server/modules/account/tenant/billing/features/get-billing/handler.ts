import type { AppContext } from '@/server/shared/infrastructure/types'

import { BillingRepository } from '../../infrastructure/billing.repo'
import { toPlanResponse, type BillingResponse } from '../response'

export const GetBillingQuery =
  ({ db }: AppContext) =>
  async (tenantId: string): Promise<BillingResponse> => {
    const repo = BillingRepository(db)

    const [subscriptionRaw, plans, usage] = await Promise.all([
      repo.getSubscriptionWithPlan(tenantId),
      repo.getPlans(),
      repo.getUsage(tenantId),
    ])

    return {
      subscription: subscriptionRaw
        ? {
            id: subscriptionRaw.id,
            status: subscriptionRaw.status,
            periodStart: subscriptionRaw.periodStart,
            periodEnd: subscriptionRaw.periodEnd,
            cancelAtPeriodEnd: subscriptionRaw.cancelAtPeriodEnd,
            plan: toPlanResponse(subscriptionRaw.plan),
          }
        : null,
      usage,
      plans: plans.map(toPlanResponse),
    }
  }
