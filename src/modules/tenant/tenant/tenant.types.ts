// src/modules/tenant/settings/hooks/types.ts
import { z } from 'zod'

export const PlanResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  interval: z.string(),
  features: z.array(z.string()),
})

export const SubscriptionResponseSchema = z.object({
  status: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
  plan: PlanResponseSchema,
})

export const TenantResponseSchema = z.object({
  id: z.uuid(),
  adminUserId: z.uuid(),
  subscription: SubscriptionResponseSchema,
})

export type PlanResponse = z.infer<typeof PlanResponseSchema>
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>
export type TenantResponse = z.infer<typeof TenantResponseSchema>
