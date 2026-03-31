import { OrganizationRoleSchema } from '@server/old/enumSchemas'
import { z } from 'zod'

export const CreateInvitationSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must include at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email format' }),
  role: OrganizationRoleSchema.default('USER'),
  iamRoleId: z.string().optional(),
})

export type CreateInvitationRequest = z.infer<typeof CreateInvitationSchema>
