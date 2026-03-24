import type { OrganizationRole } from '@prisma/client'
import type {
  CreateInvitationInput,
  UpdateInvitationInput,
} from '@server/domain/invitationSchema'
import { InvitationMapper } from '@server/mapping/organization/invitationMapping'
import db from '@server/utils/db'
import { isRoleHigher } from '@src/lib/utils'
import { DateTime } from 'luxon'

export const InvitationService = {
  getInvitationsByTeam: async (organizationId: string) => {
    const res = await db.organizationInvitation.findMany({
      where: { organizationId },
      orderBy: {
        email: 'asc',
      },
    })
    return res.map((r) => InvitationMapper.mapDefaultToApi(r))
  },

  createNewInvitation: async (
    invitation: CreateInvitationInput,
    userRole: OrganizationRole,
    organizationId: string,
  ) => {
    // Permission rule
    if (isRoleHigher(invitation.role, userRole)) {
      throw new Error('Request denied, missing permission')
    }

    // Ensure not already a user
    const existingUser = await db.organizationInvitation.findFirst({
      where: { email: invitation.email, organizationId },
    })

    if (existingUser)
      throw new Error('The invited Email has already been registered.')

    const invitationTeam = await db.team.findFirst({
      where: { id: organizationId },
    })
    if (!invitationTeam)
      throw new Error('Team the user is invited to is invalid')

    // Expiry logic
    const expiresAt = DateTime.now().plus({ day: 1 }).toJSDate()

    // TODO: Send Invitation Email through SNS Topic here

    const newInvitation = await db.organizationInvitation.create({
      data: { ...invitation, organizationId, expiresAt, inviterId: '' },
    })

    return InvitationMapper.mapDefaultToApi(newInvitation)
  },

  updateInvitation: async (
    organizationId: string,
    email: string,
    invitation: UpdateInvitationInput,
  ) => {
    const res = await db.organizationInvitation.update({
      where: {
        email,
        organizationId: organizationId,
      },
      data: {
        role: invitation.role,
        name: invitation.name,
        expiresAt: invitation.extendInvitation
          ? DateTime.now().plus({ days: 1 }).toJSDate()
          : undefined,
        email: undefined, // we do not allow updating the Email to avoid sync issues with Cognito
      },
    })

    return InvitationMapper.mapDefaultToApi(res)
  },

  deleteInvitation: async (email: string, organizationId: string) => {
    await db.organizationInvitation.deleteMany({
      where: { email, organizationId },
    })
  },
}
