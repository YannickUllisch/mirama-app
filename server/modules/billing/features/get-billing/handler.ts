import type { AppContext } from '@/server/shared/infrastructure/types'
import {
  BillingRepository,
  toPlanResponse,
} from '../../infrastructure/billing.repo'
import type { BillingResponse } from '../response'

export const GetBillingQuery =
  ({ logger }: AppContext) =>
  async (tenantId: string): Promise<BillingResponse> => {
    logger.info('Fetching billing overview')

    const repo = BillingRepository()

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
