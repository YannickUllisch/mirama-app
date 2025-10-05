import { DeleteUsersSchema, UpdateUserSchema } from '@server/domain/userSchema'
import { UserService } from '@server/services/teamService'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getTeamMembersController = async (
  _req: NextRequest,
  session: Session,
) => {
  const members = await UserService.getUsersByTeam(session.user.teamId)
  return Response.json(members, { status: 200 })
}

const updateTeamMembersController = async (
  req: NextRequest,
  session: Session,
) => {
  // Fetching ID from query
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return Response.json(
      { success: false, message: 'ID needs to be provided in query' },
      { status: 400 },
    )
  }

  // Parsing and validating body
  const body = await req.json()
  const input = UpdateUserSchema.parse(body)

  const member = await UserService.updateUser(
    id,
    session.user.role,
    session.user.teamId,
    input,
  )
  return Response.json(member, { status: 200 })
}

const deleteTeamMembersController = async (
  req: NextRequest,
  session: Session,
) => {
  const body: string[] = await req.json()
  const ids = DeleteUsersSchema.parse(body)

  if (ids.includes(session.user.id ?? ''))
    throw new Error('Can not remove yourself from Team')

  await UserService.deleteUsers(ids, session.user.role, session.user.teamId)

  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const UserController = {
  getTeamMembersController,
  updateTeamMembersController,
  deleteTeamMembersController,
}
