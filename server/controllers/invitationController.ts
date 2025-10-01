import {
  CreateInvitationSchema,
  DeleteInvitationsSchema,
  UpdateInvitationSchema,
} from '@server/domain/invitationSchema'
import { InvitationService } from '@server/services/invitationService'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getInvitationsController = async (
  _req: NextRequest,
  session: Session,
) => {
  const invitations = await InvitationService.getInvitationsByTeam(
    session.user.teamId,
  )
  return Response.json(invitations, { status: 200 })
}

const createInvitationController = async (
  req: NextRequest,
  session: Session,
) => {
  const body = await req.json()
  const parsedBody = CreateInvitationSchema.parse(body)
  const inv = await InvitationService.createNewInvitation(
    parsedBody,
    session.user.role,
    session.user.teamId,
  )
  return Response.json(inv, { status: 201 })
}

const updateInvitationsController = async (
  req: NextRequest,
  session: Session,
) => {
  const body: string[] = await req.json()
  const input = UpdateInvitationSchema.parse(body)

  const invitations = await InvitationService.updateInvitation(
    session.user.teamId,
    input,
  )
  return Response.json(invitations, { status: 200 })
}

const deleteInvitationsController = async (
  req: NextRequest,
  session: Session,
) => {
  const body = await req.json()
  const input = DeleteInvitationsSchema.parse(body)

  await InvitationService.deleteInvitations(session.user.teamId, input)
  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const InvitationController = {
  getInvitationsController,
  createInvitationController,
  updateInvitationsController,
  deleteInvitationsController,
}
