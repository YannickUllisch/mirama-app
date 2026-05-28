// src/modules/tenant/plans/hooks/types.ts
import { z } from 'zod'

export const PlanResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().int(),
  interval: z.string(),
  features: z.array(z.string()),
})

export type PlanResponse = z.infer<typeof PlanResponseSchema>
