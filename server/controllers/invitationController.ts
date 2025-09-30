import {
  CreateInvitationSchema,
  DeleteInvitationsSchema,
  UpdateInvitationSchema,
} from '@server/domain/invitationSchema'
import {
  createNewInvitation,
  deleteInvitations,
  getInvitationsByTeam,
  updateInvitation,
} from '@server/services/invitationService'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

export const getInvitationsController = async (
  _req: NextRequest,
  session: Session,
) => {
  const invitations = await getInvitationsByTeam(session.user.teamId)
  return Response.json(invitations, { status: 200 })
}

export const createInvitationController = async (
  req: NextRequest,
  session: Session,
) => {
  const body = await req.json()
  const parsedBody = CreateInvitationSchema.parse(body)
  const inv = await createNewInvitation(
    parsedBody,
    session.user.role,
    session.user.teamId,
  )
  return Response.json(inv, { status: 200 })
}

export const updateInvitationsController = async (
  req: NextRequest,
  session: Session,
) => {
  const body: string[] = await req.json()
  const input = UpdateInvitationSchema.parse(body)

  const invitations = await updateInvitation(session.user.teamId, input)
  return Response.json(invitations, { status: 200 })
}

export const deleteInvitationsController = async (
  req: NextRequest,
  session: Session,
) => {
  const body = await req.json()
  const input = DeleteInvitationsSchema.parse(body)

  await deleteInvitations(session.user.teamId, input)
  return Response.json(
    { ok: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}
