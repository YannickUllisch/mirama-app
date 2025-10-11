import { UpdateUserSchema } from '@server/domain/userSchema'
import { UserService } from '@server/services/team/teamService'
import { fromTail } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

/**
 * Assumed route: /api/db/team/member
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const getTeamMembers = async (
  _req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const members = await UserService.getUsersByTeam(session.user.teamId)
  return Response.json(members, { status: 200 })
}

/**
 * Assumed route: /api/db/team/member/${memberId}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const updateTeamMember = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const mid = fromTail(req)
  // Parsing and validating body
  const body = await req.json()
  const input = UpdateUserSchema.parse(body)

  const member = await UserService.updateUser(
    mid,
    session.user.role,
    session.user.teamId,
    input,
  )
  return Response.json(member, { status: 200 })
}

/**
 * Assumed route: /api/db/team/member/${memberId}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const deleteTeamMember = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const mid = fromTail(req)

  if (mid === session.user.id)
    throw new Error('Can not remove yourself from Team')

  await UserService.deleteUser(mid, session.user.role, session.user.teamId)

  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const UserController = {
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
}
