import { z } from 'zod'

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(2).optional(),
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(1).optional(),
})

export const OrganizationIdParams = z.object({
  organizationId: z.string().min(1),
})

export type UpdateOrganizationRequest = z.infer<typeof UpdateOrganizationSchema>
