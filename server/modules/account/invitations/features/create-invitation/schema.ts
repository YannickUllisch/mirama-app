import { OrganizationRoleSchema } from '@/serverOld/domain/enumSchemas'
import { z } from 'zod'

export const CreateInvitationSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must include at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email format' }),
  role: OrganizationRoleSchema.default('USER'),
})

export type CreateInvitationRequest = z.infer<typeof CreateInvitationSchema>
