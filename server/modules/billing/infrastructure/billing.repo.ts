import database from '@db'
import type { PlanFeatures, PlanResponse } from '../features/response'

const toPlainPlanFeatures = (raw: unknown): PlanFeatures => {
  const f = (raw ?? {}) as Record<string, unknown>
  return {
    maxOrganizations: Number(f.maxOrganizations ?? 1),
    maxMembersPerOrg: Number(f.maxMembersPerOrg ?? 5),
    maxProjectsPerOrg: Number(f.maxProjectsPerOrg ?? 10),
    apiAccess: Boolean(f.apiAccess ?? false),
    advancedReporting: Boolean(f.advancedReporting ?? false),
    prioritySupport: Boolean(f.prioritySupport ?? false),
    ...f,
  }
}

export const toPlanResponse = (plan: {
  id: string
  name: string
  description: string | null
  price: number
  interval: string
  features: unknown
}): PlanResponse => ({
  id: plan.id,
  name: plan.name,
  description: plan.description,
  price: plan.price,
  interval: plan.interval,
  features: toPlainPlanFeatures(plan.features),
})

export const BillingRepository = () => ({
  async getSubscriptionWithPlan(tenantId: string) {
    return await database.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    })
  },

  async getPlans() {
    return await database.plan.findMany({ orderBy: { price: 'asc' } })
  },

  async getUsage(tenantId: string) {
    const [organizations, members, projects] = await Promise.all([
      database.organization.count({ where: { tenantId } }),
      database.member.count({ where: { organization: { tenantId } } }),
      database.project.count({ where: { organization: { tenantId } } }),
    ])
    return { organizations, members, projects }
  },
})
