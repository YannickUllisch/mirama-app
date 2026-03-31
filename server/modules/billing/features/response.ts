import type { SubscriptionStatus } from '@prisma/client'

export type PlanFeatures = {
  maxOrganizations: number
  maxMembersPerOrg: number
  maxProjectsPerOrg: number
  apiAccess: boolean
  advancedReporting: boolean
  prioritySupport: boolean
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
