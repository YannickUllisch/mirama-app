import { z } from 'zod'

export const BillingUsageSchema = z.object({
  organizations: z.number().int(),
  members: z.number().int(),
  projects: z.number().int(),
})
export type BillingUsage = z.infer<typeof BillingUsageSchema>
