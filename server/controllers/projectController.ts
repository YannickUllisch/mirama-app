import { CreateProjectSchema } from '@server/domain/projectSchema'
import { ProjectService } from '@server/services/projectService'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const createProjectController = async (req: NextRequest, session: Session) => {
  const body = await req.json()
  const parsedBody = CreateProjectSchema.parse(body)
  const project = await ProjectService.createProject(
    parsedBody,
    session.user.teamId,
  )
  return Response.json(project, { status: 201 })
}

export const ProjectController = {
  createProjectController,
}
