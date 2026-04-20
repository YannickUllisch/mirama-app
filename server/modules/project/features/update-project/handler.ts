import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectEntity } from '../../domain/project.entity'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'
import type { UpdateProjectRequest } from './schema'

export const UpdateProjectCommand =
  ({ db }: AppContext) =>
  async (projectId: string, input: UpdateProjectRequest) => {
    const repo = ProjectRepository(db)

    // Check unique name (exclude self)
    const existing = await repo.findByName(input.name)
    if (existing && existing.id !== projectId) {
      ProjectEntity.assertUniqueProjectName(existing)
    }

    const { members, milestones, tags, newTags, ...proj } = input

    // Fetch existing milestones to diff
    const existingMilestones = await db.milestone.findMany({
      where: { projectId },
      select: { id: true },
    })
    const inputIds = milestones.filter((m) => m.id).map((m) => m.id as string)
    const idsToDelete = existingMilestones
      .map((m) => m.id)
      .filter((id) => !inputIds.includes(id))

    // Use a transaction for atomicity
    const project = await db.$transaction(async (prisma: any) => {
      // Update project fields + tags
      const updated = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...proj,
          tags: {
            set: tags.map((id: string) => ({ id })),
            create: newTags.map((t: { title: string }) => ({ title: t.title })),
          },
        },
        include: {
          milestones: true,
          tags: true,
          tasks: true,
          members: { include: { member: true } },
        },
      })

      // Replace member relations
      await prisma.projectMember.deleteMany({ where: { projectId } })
      if (members.length > 0) {
        await prisma.projectMember.createMany({
          data: members.map((m: { memberId: string }) => ({
            ...m,
            projectId,
          })),
        })
      }

      // Delete removed milestones
      if (idsToDelete.length > 0) {
        await prisma.milestone.deleteMany({
          where: { id: { in: idsToDelete } },
        })
      }

      // Upsert milestones
      await Promise.all(
        milestones.map((m) =>
          prisma.milestone.upsert({
            where: { id: m.id ?? '' },
            update: {
              date: m.date,
              title: m.title,
              colors: m.colors,
              projectId,
            },
            create: {
              date: m.date,
              title: m.title,
              colors: m.colors,
              projectId,
            },
          }),
        ),
      )

      return updated
    })

    return toProjectResponse(project)
  }
