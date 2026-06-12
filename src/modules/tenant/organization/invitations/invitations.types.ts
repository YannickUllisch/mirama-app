// src/modules/tenant/organization/invitations/invitationTypes.ts
import { z } from 'zod'

export const InvitationStatusSchema = z.enum([
  'Pending',
  'Accepted',
  'Declined',
  'Revoked',
  'Expired',
])
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>

export const InvitationResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  inviterId: z.string().uuid(),
  iamRoleId: z.string().uuid(),
  status: InvitationStatusSchema,
  expiresAt: z.coerce.date(),
  organizationId: z.string().uuid(),
  organizationName: z.string(),
})
export type InvitationResponse = z.infer<typeof InvitationResponseSchema>

export const SendInvitationSchema = z.object({
  email: z.string().max(320),
  name: z.string().min(1).max(200),
  iamRoleId: z.string(),
})
export type SendInvitationCommand = z.infer<typeof SendInvitationSchema>
