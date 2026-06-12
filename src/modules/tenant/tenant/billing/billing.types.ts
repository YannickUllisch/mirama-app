import { z } from 'zod'

export const BillingUsageResponseSchema = z.object({
  organizations: z.number().int(),
  members: z.number().int(),
  projects: z.number().int(),
})
export type BillingUsageResponse = z.infer<typeof BillingUsageResponseSchema>

export const PlanResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().int(),
  interval: z.string(),
  features: z.array(z.string()),
})
export type PlanResponse = z.infer<typeof PlanResponseSchema>
