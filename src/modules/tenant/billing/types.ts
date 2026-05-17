import z from 'zod'

export const PlanResponse = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().int(),
  interval: z.string(),
  features: z.array(z.string()),
})
