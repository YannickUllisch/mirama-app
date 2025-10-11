import { UpdateUserSchema } from '@server/domain/userSchema'
import { UserService } from '@server/services/team/teamService'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

const getTeamMembers = async (
  _req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const members = await UserService.getUsersByTeam(session.user.teamId)
  return Response.json(members, { status: 200 })
}

const updateTeamMember = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  // Fetching ID from query
  const mid = req.nextUrl.pathname.split('/').pop()

  if (!mid) {
    return Response.json(
      { ok: false, message: 'Member ID is required in Request' },
      { status: 404 },
    )
  }

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

const deleteTeamMember = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const mid = req.nextUrl.pathname.split('/').pop()

  if (!mid) {
    return Response.json(
      { ok: false, message: 'Member ID is required in Request' },
      { status: 404 },
    )
  }

  if (mid.includes(session.user.id ?? ''))
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
