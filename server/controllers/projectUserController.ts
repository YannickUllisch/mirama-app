import { UpdateProjectUsersSchema } from '@server/domain/projectUserSchema'
import { ProjectUserService } from '@server/services/projectUserService'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getProjectUsersController = async (
  req: NextRequest,
  session: Session,
) => {
  const pid = req.nextUrl.searchParams.get('projectId')

  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID is required in Request' },
      { status: 404 },
    )
  }
  const puEntries = await ProjectUserService.getProjectUserJoinsByProject(
    pid,
    session.user.teamId,
  )
  return Response.json(puEntries, { status: 200 })
}

const updateProjectUsersController = async (
  req: NextRequest,
  session: Session,
) => {
  const pid = req.nextUrl.searchParams.get('projectId') as string
  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID is required in Request' },
      { status: 404 },
    )
  }

  const body = await req.json()
  const input = UpdateProjectUsersSchema.parse(body)

  await ProjectUserService.updateProjectUserJoin(
    pid,
    session.user.id ?? '',
    input,
    isTeamAdminOrOwner(session),
  )

  return Response.json(
    { success: true, message: 'Updated successfully' },
    { status: 200 },
  )
}

export const ProjectUserController = {
  updateProjectUsersController,
  getProjectUsersController,
}
