import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'

export const GetProjectQuery =
  ({ db }: AppContext) =>
  async (projectId: string, sessionMemberId: string) => {
    const repo = ProjectRepository(db)
    const project = await repo.findById(projectId)

    if (!project) throw new Error('Project not found')

    const isMember = project.members.some((m) => m.memberId === sessionMemberId)
    if (!isMember) throw new Error('Insufficient permission')

    return toProjectResponse(project)
  }
