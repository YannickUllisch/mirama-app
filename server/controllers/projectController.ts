import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from '@server/domain/projectSchema'
import { ProjectService } from '@server/services/project/projectService'
import { checkIfManager } from '@server/utils/checkManager'
import { fromTail, pickFromTail } from '@server/utils/getDynamicRoute'
import { isOrgAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

export const ProjectController = {
  /**
   * Assumed route: /api/db/project
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  getAllProjects: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    const archivedStatus = req.nextUrl.searchParams.get('archived') === 'true'

    const roleCheck = isOrgAdminOrOwner(session)

    const res = await ProjectService.getAllProjects(
      session.user.id ?? '',
      session.user.organizationId ?? '',
      archivedStatus,
      roleCheck,
    )

    return Response.json(res, { status: 200 })
  },

  /**
   * Assumed route: /api/db/project/${projectId}
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  getProjectById: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    const pid = fromTail(req)

    const roleCheck = isOrgAdminOrOwner(session)

    const project = await ProjectService.getDefaultProjectResponse(
      pid,
      session.user.teamId,
      session.user.id ?? '',
      roleCheck,
    )

    return Response.json(project, { status: 200 })
  },

  /**
   * Assumed route: /api/db/project/${projectId}/users
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  getProjectAssignees: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    // Extracting ID from route
    const [pid] = pickFromTail(req, [1])

    const isAdminOrOwner = isOrgAdminOrOwner(session)

    const users = await ProjectService.getProjectAssignees(
      pid,
      session.user.teamId,
      session.user.id ?? '',
      isAdminOrOwner,
    )

    return Response.json(users, { status: 200 })
  },

  /**
   * Assumed route: /api/db/project/${projectId}
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  deleteProjectById: async (
    req: NextRequest,
    session: Session,
    logger: Logger,
  ) => {
    const ctrLogger = logger.child({
      module: 'ProjectController',
      op: 'deleteProject',
    })

    const pid = fromTail(req)

    await ProjectService.deleteProject(pid, session.user.teamId)
    ctrLogger.info({ projectId: pid, msg: 'Project deleted' })

    return Response.json(
      { success: true, message: 'Deleted successfully' },
      { status: 200 },
    )
  },

  /**
   * Assumed route: /api/db/project
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  createProject: async (req: NextRequest, session: Session, logger: Logger) => {
    const ctrLogger = logger.child({
      module: 'ProjectController',
      op: 'createProject',
    })
    const body = await req.json()
    const parsedBody = CreateProjectSchema.parse(body)
    const project = await ProjectService.createProject(
      parsedBody,
      session.user.teamId,
    )

    ctrLogger.info('New Project created')

    return Response.json(project, { status: 201 })
  },

  /**
   * Assumed route: /api/db/project/${projectId}
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  updateProject: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    const pid = fromTail(req)

    const body = await req.json()
    const parsedBody = UpdateProjectSchema.parse(body)

    const isManager = await checkIfManager(pid, session.user.id ?? '')

    if (!isManager && !isOrgAdminOrOwner(session)) {
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
  },

  /**
   * Assumed route: /api/db/project/${projectId}/archive||unarchive
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  archiveProject: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    // Assumed route /api/db/project/{id}/archiveORunarchive
    const [statusSegment, pid] = pickFromTail(req, [0, 1])
    const archiveStatus = statusSegment === 'archive'

    const project = await ProjectService.archiveProject(
      pid,
      session.user.teamId,
      archiveStatus,
    )

    return Response.json(project, { status: 200 })
  },
}
