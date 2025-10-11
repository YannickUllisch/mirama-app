import type { Role } from '@prisma/client'
import type {
  CreateInvitationInput,
  UpdateInvitationInput,
} from '@server/domain/invitationSchema'
import { InvitationMapper } from '@server/mapping/general/invitationMapping'
import db from '@server/utils/db'
import { isRoleHigher } from '@src/lib/utils'
import { DateTime } from 'luxon'

const getInvitationsByTeam = async (teamId: string) => {
  const res = await db.companyInvitation.findMany({
    where: { teamId },
    orderBy: {
      email: 'asc',
    },
  })
  return res.map((r) => InvitationMapper.mapDefaultToApi(r))
}

const createNewInvitation = async (
  invitation: CreateInvitationInput,
  userRole: Role,
  teamId: string,
) => {
  // Permission rule
  if (isRoleHigher(invitation.role, userRole)) {
    throw new Error('Request denied, missing permission')
  }

  // Ensure not already a user
  const existingUser = await db.companyInvitation.findFirst({
    where: { email: invitation.email, teamId },
  })

  if (existingUser)
    throw new Error('The invited Email has already been registered.')

  const invitationTeam = await db.team.findFirst({ where: { id: teamId } })
  if (!invitationTeam) throw new Error('Team the user is invited to is invalid')

  // Expiry logic
  const expiresAt = DateTime.now().plus({ day: 1 }).toJSDate()

  // TODO: Send Invitation Email through SNS Topic here

  const newInvitation = await db.companyInvitation.create({
    data: { ...invitation, teamId, expiresAt },
  })

  return InvitationMapper.mapDefaultToApi(newInvitation)
}

const updateInvitation = async (
  teamId: string,
  email: string,
  invitation: UpdateInvitationInput,
) => {
  const res = await db.companyInvitation.update({
    where: {
      email,
      teamId: teamId,
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
}

const deleteInvitation = async (email: string, teamId: string) => {
  await db.companyInvitation.deleteMany({
    where: { email, teamId },
  })
}

export const InvitationService = {
  getInvitationsByTeam,
  createNewInvitation,
  updateInvitation,
  deleteInvitation,
}
