import db from '@db'
import type { CreateProjectInput } from '@server/domain/projectSchema'
import { v4 } from 'uuid'

const createProject = async (input: CreateProjectInput, teamId: string) => {
  const project = await db.project.create({
    data: {
      ...input,
      tags: {
        connectOrCreate: input.tags.map((tagString) => ({
          where: { id: tagString },
          create: { id: v4(), title: tagString, teamId },
        })),
      },
      users: {
        createMany: {
          data: input.users,
        },
      },
      milestones: {
        createMany: {
          data: input.milestones,
        },
      },
      teamId,
    },
  })

  return project
}

const deleteProject = async (pid: string, teamId: string) => {
  await db.project.delete({
    where: { id: pid, teamId },
  })
}

export const ProjectService = {
  deleteProject,
  createProject,
}
