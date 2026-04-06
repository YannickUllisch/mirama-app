import type { ScopedDb } from '@scopedDb'

export const BillingRepository = (db: ScopedDb) => ({
  async getSubscriptionWithPlan(tenantId: string) {
    return await db.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    })
  },

  async getPlans() {
    return await db.plan.findMany({ orderBy: { price: 'asc' } })
  },

  async getUsage(tenantId: string) {
    const [organizations, members, projects] = await Promise.all([
      db.organization.count({ where: { tenantId } }),
      db.member.count({ where: { organization: { tenantId } } }),
      db.project.count({ where: { organization: { tenantId } } }),
    ])
    return { organizations, members, projects }
  },
})
