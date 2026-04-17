import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectEntity } from '../../domain/project.entity'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'
import type { CreateProjectRequest } from './schema'

export const CreateProjectCommand =
  ({ db }: AppContext) =>
  async (input: CreateProjectRequest, organizationId: string) => {
    const repo = ProjectRepository(db)
    const existing = await repo.findByName(input.name)
    ProjectEntity.assertUniqueProjectName(existing)

    const { tags, newTags, members, newMilestones, ...proj } = input

    const project = await repo.create({
      ...proj,
      organizationId,
      tags: {
        connect: tags.map((id) => ({ id })),
        create: newTags.map((t) => ({ title: t.title, organizationId })),
      },
      members: {
        createMany: {
          data: members.map((m) => ({ ...m, organizationId })),
        },
      },
      milestones: {
        createMany: {
          data: newMilestones.map((ms) => ({ ...ms, organizationId })),
        },
      },
    })

    return toProjectResponse(project)
  }
