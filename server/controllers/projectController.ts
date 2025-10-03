import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from '@server/domain/projectSchema'
import { ProjectService } from '@server/services/projectService'
import { checkIfManager } from '@server/utils/checkManager'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getDefaultProjectController = async (
  req: NextRequest,
  session: Session,
) => {
  const pid = req.nextUrl.searchParams.get('id')

  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID is required in Request' },
      { status: 404 },
    )
  }
  const project = await ProjectService.getDefaultProjectResponse(
    pid,
    session.user.teamId,
  )

  return Response.json(project, { status: 201 })
}

const createProjectController = async (req: NextRequest, session: Session) => {
  const body = await req.json()
  const parsedBody = CreateProjectSchema.parse(body)
  const project = await ProjectService.createProject(
    parsedBody,
    session.user.teamId,
  )
  return Response.json(project, { status: 201 })
}

const updateProjectController = async (req: NextRequest, session: Session) => {
  const pid = req.nextUrl.searchParams.get('id')

  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID is required in Request' },
      { status: 404 },
    )
  }

  const body = await req.json()
  const parsedBody = UpdateProjectSchema.parse(body)

  const isManager = await checkIfManager(pid, session.user.id ?? '')

  if (!isManager && !isTeamAdminOrOwner(session)) {
    return Response.json(
      { ok: false, message: 'Not allowed to perform this action' },
      { status: 404 },
    )
  }
  const project = await ProjectService.updateProject(
    parsedBody,
    pid,
    session.user.teamId,
  )
  return Response.json(project, { status: 200 })
}

export const ProjectController = {
  getDefaultProjectController,
  createProjectController,
  updateProjectController,
}
