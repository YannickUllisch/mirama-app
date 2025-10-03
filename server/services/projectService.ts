import db from '@db'
import type {
  CreateProjectInput,
  ProjectResponseInput,
  UpdateProjectInput,
} from '@server/domain/projectSchema'
import { ProjectMapper } from '@server/mapping/project/projectMapping'
import { withPrismaErrorSanitizer } from '@server/utils/errorSanitizer'
import { v4 } from 'uuid'

const getDefaultProjectResponse = async (
  projectId: string,
  teamId: string,
): Promise<ProjectResponseInput | null> => {
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      teamId,
    },
    include: {
      milestones: true,
      tags: true,
      tasks: true,
      users: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!project) return null

  return ProjectMapper.mapDefaultToApi(project)
}

const updateProject = async (
  input: UpdateProjectInput,
  projectId: string,
  teamId: string,
) =>
  withPrismaErrorSanitizer(async () => {
    const { users, milestones, tags, ...proj } = input

    return await db.$transaction(async (prisma) => {
      // Updating the project main fields and tags
      const project = await prisma.project.update({
        where: { id: projectId, teamId },
        data: {
          ...proj,
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: { id: tag },
              create: { title: tag, teamId },
            })),
          },
          teamId,
        },
      })

      // Syncronizing users by recreation
      await prisma.projectUser.deleteMany({ where: { projectId } })
      if (users && users.length > 0) {
        await prisma.projectUser.createMany({
          data: users.map((u) => ({ ...u, projectId })),
        })
      }

      // Syncronizing milestones
      const existingMilestones = await prisma.milestone.findMany({
        where: { projectId },
        select: { id: true },
      })
      const inputIds = milestones.filter((m) => m.id).map((m) => m.id)
      const idsToDelete = existingMilestones
        .map((m) => m.id)
        .filter((id) => !inputIds.includes(id))

      if (idsToDelete.length > 0) {
        await prisma.milestone.deleteMany({
          where: { id: { in: idsToDelete } },
        })
      }

      await Promise.all(
        milestones.map((m) =>
          m.id
            ? prisma.milestone.update({
                where: { id: m.id },
                data: { ...m, projectId },
              })
            : prisma.milestone.create({ data: { ...m, projectId } }),
        ),
      )

      return project
    })
  })

const createProject = async (input: CreateProjectInput, teamId: string) => {
  withPrismaErrorSanitizer(async () => {
    const { newMilestones, newTags, ...proj } = input
    const project = await db.project.create({
      data: {
        ...proj,
        tags: {
          connect: input.tags.map((id) => ({ id })),
          create: input.newTags.map((t) => ({
            id: v4(),
            title: t.title,
            teamId,
          })),
        },
        users: {
          createMany: {
            data: input.users,
          },
        },
        milestones: {
          createMany: {
            data: input.newMilestones,
          },
        },
        teamId,
      },
    })

    return project
  })
}

const deleteProject = async (pid: string, teamId: string) => {
  await db.project.delete({
    where: { id: pid, teamId },
  })
}

export const ProjectService = {
  getDefaultProjectResponse,
  deleteProject,
  createProject,
  updateProject,
}
