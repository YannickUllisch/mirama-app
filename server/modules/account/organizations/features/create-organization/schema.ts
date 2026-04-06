import { z } from 'zod'

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2),
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.string().min(1),
})

export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationSchema>
