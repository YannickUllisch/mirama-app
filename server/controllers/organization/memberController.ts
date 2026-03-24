import { UpdateUserSchema } from '@server/domain/memberSchema'
import { fromTail } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

export const TeamController = {
  /**
   * Assumed route: /api/db/team/member
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  getTeamMembers: async (
    _req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    const members = await UserService.getUsersByTeam(session.user.teamId)
    return Response.json(members, { status: 200 })
  },

  /**
   * Assumed route: /api/db/team/member/${memberId}
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  updateTeamMember: async (
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
  },
  /**
   * Assumed route: /api/db/team/member/${memberId}
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  deleteTeamMember: async (
    req: NextRequest,
    session: Session,
    logger: Logger,
  ) => {
    const mid = fromTail(req)
    const teamLogger = logger.child({
      module: 'TeamController',
      op: 'deleteMember',
    })

    if (mid === session.user.id) {
      teamLogger.warn('Cannot remove yourself from Team')
      throw new Error('Can not remove yourself from Team')
    }

    await UserService.deleteUser(mid, session.user.role, session.user.teamId)

    return Response.json(
      { success: true, message: 'Deleted successfully' },
      { status: 200 },
    )
  },
}
