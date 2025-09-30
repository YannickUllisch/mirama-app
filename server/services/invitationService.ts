import db from '@db'
import type { Role } from '@prisma/client'
import type {
  CreateInvitationInput,
  UpdateInvitationInput,
} from '@server/domain/invitationSchema'
import { inviteUserCognito } from '@src/lib/auth/cognito/inviteUser'
import { isRoleHigher } from '@src/lib/utils'
import { DateTime } from 'luxon'

export const getInvitationsByTeam = async (teamId: string) => {
  return await db.companyInvitation.findMany({ where: { teamId } })
}

export const createNewInvitation = async (
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

  // Create Cognito user before DB entry
  const cognitoRes = await inviteUserCognito({ email: invitation.email })
  if (cognitoRes.error)
    throw new Error(`Cognito invitation failed: ${cognitoRes.error}`)

  const newInvitation = db.companyInvitation.create({
    data: { ...invitation, teamId, expiresAt },
  })

  return newInvitation
}

export const updateInvitation = async (
  teamId: string,
  invitation: UpdateInvitationInput,
) => {
  return await db.companyInvitation.update({
    where: {
      email: invitation.email,
      teamId: teamId,
    },
    data: {
      ...invitation,
      expiresAt: invitation.extendInvitation
        ? DateTime.now().plus({ days: 1 }).toJSDate()
        : undefined,
    },
  })
}

export const deleteInvitations = async (teamId: string, emails: string[]) => {
  await db.$transaction(async (prisma) => {
    const existing = await prisma.companyInvitation.findMany({
      where: { email: { in: emails }, teamId },
    })

    if (existing.length !== emails.length) {
      throw new Error('Some invitations not found or unauthorized')
    }

    await prisma.companyInvitation.deleteMany({
      where: { email: { in: emails }, teamId },
    })
  })
}
