import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'

export const GetProjectsQuery =
  ({ db }: AppContext) =>
  async (memberId: string, archived: boolean) => {
    const repo = ProjectRepository(db)
    const projects = await repo.findAll({ memberId, archived })
    return projects.map(toProjectResponse)
  }
