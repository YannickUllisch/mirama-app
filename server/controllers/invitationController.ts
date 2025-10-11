import {
  CreateInvitationSchema,
  UpdateInvitationSchema,
} from '@server/domain/invitationSchema'
import { InvitationService } from '@server/services/general/invitationService'
import { fromTail } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

/**
 * Assumed route: /api/db/invite
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const getInvitations = async (
  _req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const invitations = await InvitationService.getInvitationsByTeam(
    session.user.teamId,
  )
  return Response.json(invitations, { status: 200 })
}

/**
 * Assumed route: /api/db/invite
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const createInvitation = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
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

/**
 * Assumed route: /api/db/invite/${email}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const updateInvitation = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const id = fromTail(req)

  const body: string[] = await req.json()
  const input = UpdateInvitationSchema.parse(body)

  const invitations = await InvitationService.updateInvitation(
    session.user.teamId,
    id,
    input,
  )
  return Response.json(invitations, { status: 200 })
}

/**
 * Assumed route: /api/db/invite/${email}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const deleteInvitation = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const id = fromTail(req)

  await InvitationService.deleteInvitation(id, session.user.teamId)
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
