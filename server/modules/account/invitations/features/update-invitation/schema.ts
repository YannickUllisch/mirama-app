import { OrganizationRoleSchema } from '@/serverOld/domain/enumSchemas'
import { z } from 'zod'

export const UpdateInvitationSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must include at least 3 characters' }),
  organizationRole: OrganizationRoleSchema.default('USER'),
  extendInvitation: z.boolean().default(false),
})

export const InvitationEmailParams = z.object({
  email: z.string().email(),
})

export type UpdateInvitationRequest = z.infer<typeof UpdateInvitationSchema>
export type InvitationEmailRequest = z.infer<typeof InvitationEmailParams>
