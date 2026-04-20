import type { SubscriptionStatus } from '@/prisma/generated/client'

export type PlanFeatures = {
  maxOrganizations: number
  maxMembersPerOrg: number
  maxProjectsPerOrg: number
  storageGb: number
  hasApprovalFlows: boolean
  canCustomBrand: boolean
  [key: string]: unknown
}

export type PlanResponse = {
  id: string
  name: string
  description: string | null
  price: number
  interval: string
  features: PlanFeatures
}

export type SubscriptionResponse = {
  id: string
  status: SubscriptionStatus
  periodStart: Date
  periodEnd: Date
  cancelAtPeriodEnd: boolean
  plan: PlanResponse
}

export type BillingUsage = {
  organizations: number
  members: number
  projects: number
}

export type BillingResponse = {
  subscription: SubscriptionResponse | null
  usage: BillingUsage
  plans: PlanResponse[]
}

const toPlainPlanFeatures = (raw: unknown): PlanFeatures => {
  const f = (raw ?? {}) as Record<string, unknown>
  return {
    maxOrganizations: Number(f.maxOrganizations ?? 1),
    maxMembersPerOrg: Number(f.maxMembersPerOrg ?? 5),
    maxProjectsPerOrg: Number(f.maxProjectsPerOrg ?? 10),
    storageGb: Number(f.storageGb ?? 0),
    hasApprovalFlows: Boolean(f.hasApprovalFlows ?? false),
    canCustomBrand: Boolean(f.canCustomBrand ?? false),
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
