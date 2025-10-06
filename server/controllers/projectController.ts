import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from '@server/domain/projectSchema'
import { ProjectService } from '@server/services/projectService'
import { checkIfManager } from '@server/utils/checkManager'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getAllProjects = async (req: NextRequest, session: Session) => {
  const { searchParams } = new URL(req.url)
  const archivedStatus = (searchParams.get('archived') as string) === 'true'

  const roleCheck = isTeamAdminOrOwner(session)

  const res = await ProjectService.getAllProjects(
    session.user.id ?? '',
    session.user.teamId,
    archivedStatus,
    roleCheck,
  )

  return Response.json(res, { status: 200 })
}

const getProjectById = async (req: NextRequest, session: Session) => {
  // Extracting name from dynamic route
  const pid = req.nextUrl.pathname.split('/').pop()

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

  return Response.json(project, { status: 200 })
}

const deleteProjectById = async (req: NextRequest, session: Session) => {
  // Extracting name from dynamic route
  const pid = req.nextUrl.pathname.split('/').pop()

  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID is required in Request' },
      { status: 404 },
    )
  }
  const project = await ProjectService.deleteProject(pid, session.user.teamId)

  return Response.json(project, { status: 200 })
}

const getProjectAssignees = async (req: NextRequest, session: Session) => {
  // Extracting name from query
  const pid = req.nextUrl.searchParams.get('id')

  if (!pid) {
    return Response.json(
      { ok: false, message: 'Project ID is required in Request' },
      { status: 404 },
    )
  }
  const users = await ProjectService.getProjectAssignees(
    pid,
    session.user.teamId,
  )

  return Response.json(users, { status: 200 })
}

const createProject = async (req: NextRequest, session: Session) => {
  const body = await req.json()
  const parsedBody = CreateProjectSchema.parse(body)
  const project = await ProjectService.createProject(
    parsedBody,
    session.user.teamId,
  )
  return Response.json(project, { status: 201 })
}

const updateProject = async (req: NextRequest, session: Session) => {
  const pid = req.nextUrl.pathname.split('/').pop()

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

const archiveProject = async (req: NextRequest, session: Session) => {
  // Assumed route /api/db/project/{id}/archiveORunarchive
  const segments = req.nextUrl.pathname.split('/').filter(Boolean)
  const pid = segments[segments.length - 2]
  const archiveStatus = segments[segments.length - 1] === 'archive'

  const project = await ProjectService.archiveProject(
    pid,
    session.user.teamId,
    archiveStatus,
  )

  return Response.json(project, { status: 200 })
}

export const ProjectController = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  getProjectAssignees,
  deleteProjectById,
  archiveProject,
}
