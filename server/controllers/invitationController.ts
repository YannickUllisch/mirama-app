import {
  CreateInvitationSchema,
  UpdateInvitationSchema,
} from '@server/domain/invitationSchema'
import { InvitationService } from '@server/services/invitationService'
import { getDynamicRoute } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getInvitations = async (_req: NextRequest, session: Session) => {
  const invitations = await InvitationService.getInvitationsByTeam(
    session.user.teamId,
  )
  return Response.json(invitations, { status: 200 })
}

const createInvitation = async (req: NextRequest, session: Session) => {
  const body = await req.json()
  const parsedBody = CreateInvitationSchema.parse(body)
  const inv = await InvitationService.createNewInvitation(
    parsedBody,
    session.user.role,
    session.user.teamId,
  )
  return Response.json(inv, { status: 201 })
}

const updateInvitation = async (req: NextRequest, session: Session) => {
  const id = getDynamicRoute(req)

  const body: string[] = await req.json()
  const input = UpdateInvitationSchema.parse(body)

  const invitations = await InvitationService.updateInvitation(
    session.user.teamId,
    id,
    input,
  )
  return Response.json(invitations, { status: 200 })
}

const deleteInvitation = async (req: NextRequest, session: Session) => {
  const id = getDynamicRoute(req)

  await InvitationService.deleteInvitation(session.user.teamId, id)
  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const InvitationController = {
  getInvitations,
  createInvitation,
  updateInvitation,
  deleteInvitation,
}
