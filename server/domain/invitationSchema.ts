import z from 'zod'
import { OrganizationRoleSchema } from './enumSchemas'

export const InvitationResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  organizationRole: OrganizationRoleSchema,
  organizationId: z.string(),
  expiresAt: z.coerce.date(),
})

export const CreateInvitationSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must include at least 3 characters',
  }),
  email: z.string().email({
    message: 'Invalid email format',
  }),
  role: OrganizationRoleSchema.default('USER'),
})

export const UpdateInvitationSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must include at least 3 characters',
  }),
  role: OrganizationRoleSchema.default('USER'),
  extendInvitation: z.boolean().default(false),
})

export const DeleteInvitationsSchema = z.array(
  z.string().min(1, 'Array of atleast one Email is required'),
)

// TypeScript types inferred from schemas
export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>
export type DeleteInvitationsInput = z.infer<typeof DeleteInvitationsSchema>
export type UpdateInvitationInput = z.infer<typeof UpdateInvitationSchema>
export type InvitationResponseType = z.infer<typeof InvitationResponseSchema>
