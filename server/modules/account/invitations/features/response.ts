import type { OrganizationInvitation } from '@prisma/client'

export type InvitationResponse = {
  id: string
  email: string
  name: string
  organizationRole: string
  organizationId: string
  expiresAt: Date
}

export const toInvitationResponse = (
  inv: OrganizationInvitation,
): InvitationResponse => ({
  id: inv.id,
  email: inv.email,
  name: inv.name,
  organizationRole: inv.role,
  organizationId: inv.organizationId,
  expiresAt: inv.expiresAt,
})
