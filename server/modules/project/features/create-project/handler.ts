import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectEntity } from '../../domain/project.entity'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'
import type { CreateProjectRequest } from './schema'

export const CreateProjectCommand =
  ({ db, logger }: AppContext) =>
  async (input: CreateProjectRequest) => {
    logger.info({ name: input.name }, 'Creating project')

    const repo = ProjectRepository(db)
    const existing = await repo.findByName(input.name)
    ProjectEntity.assertUniqueProjectName(existing)

    const { tags, newTags, members, newMilestones, ...proj } = input

    const project = await repo.create({
      ...proj,
      tags: {
        connect: tags.map((id) => ({ id })),
        create: newTags.map((t) => ({ title: t.title })),
      },
      members: { createMany: { data: members } },
      milestones: { createMany: { data: newMilestones } },
    })

    return toProjectResponse(project)
  }
