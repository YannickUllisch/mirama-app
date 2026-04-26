import type { OrganizationInvitation } from '@/prisma/generated/client'

export type InvitationResponse = {
  id: string
  email: string
  name: string
  iamRoleId: string
  organizationId: string
  organizationName: string
  expiresAt: Date
}

export const toInvitationResponse = (
  inv: OrganizationInvitation & { organization?: { name: string } | null },
): InvitationResponse => ({
  id: inv.id,
  email: inv.email,
  name: inv.name,
  iamRoleId: inv.iamRoleId ?? '',
  organizationId: inv.organizationId,
  organizationName: inv.organization?.name ?? '',
  expiresAt: inv.expiresAt,
})
