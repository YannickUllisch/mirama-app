import type {
  CreateProjectInput,
  ProjectResponseInput,
  UpdateProjectInput,
} from '@server/domain/projectSchema'
import type { UserResponseType } from '@server/domain/userSchema'
import { ProjectMapper } from '@server/mapping/project/projectMapping'
import { UserMapper } from '@server/mapping/user/userMapping'
import db from '@server/utils/db'
import { v4 } from 'uuid'

export const ProjectService = {
  getAllProjects: async (
    sessionUserId: string,
    teamId: string,
    onlyArchived: boolean,
    isTeamAdminOrOwner: boolean,
  ): Promise<ProjectResponseInput[]> => {
    const res = await db.project.findMany({
      where: {
        teamId: teamId,
        archived: onlyArchived,
        ...(isTeamAdminOrOwner
          ? {} // Admins should see all projects, so we remove the users filter
          : {
              users: {
                some: {
                  userId: sessionUserId,
                },
              },
            }),
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
      orderBy: {
        name: 'asc',
      },
    })

    return res.map((r) => ProjectMapper.mapDefaultToApi(r))
  },

  getProjectAssignees: async (
    projectId: string,
    teamId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ): Promise<UserResponseType[]> => {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        teamId,
      },
      select: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (
      !project?.users.map((u) => u.userId).includes(sessionUserId) &&
      !isAdminOrOwner
    ) {
      throw new Error('Invalid permission')
    }

    const res = await db.user.findMany({
      where: {
        projects: {
          some: {
            projectId,
          },
        },
        teamId: teamId,
      },
    })

    return res.map((r) => UserMapper.mapDefaultToApi(r))
  },

  getDefaultProjectResponse: async (
    projectId: string,
    teamId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
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

    if (!project) throw new Error('Project not Found')

    if (
      !project.users.map((u) => u.userId).includes(sessionUserId) &&
      !isAdminOrOwner
    ) {
      throw new Error('Invalid Permission')
    }

    return ProjectMapper.mapDefaultToApi(project)
  },

  updateProject: async (
    input: UpdateProjectInput,
    projectId: string,
    teamId: string,
  ) => {
    const { users, milestones, tags, ...proj } = input

    const existingMilestones = await db.milestone.findMany({
      where: { projectId },
      select: { id: true },
    })
    const inputIds = milestones.filter((m) => m.id).map((m) => m.id)
    const idsToDelete = existingMilestones
      .map((m) => m.id)
      .filter((id) => !inputIds.includes(id))

    const res = await db.$transaction(async (prisma) => {
      // Update project itself
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

      // Update user relations
      await prisma.projectUser.deleteMany({ where: { projectId } })
      if (users && users.length > 0) {
        await prisma.projectUser.createMany({
          data: users.map((u) => ({ ...u, projectId })),
        })
      }

      // Delete removed milestones
      if (idsToDelete.length > 0) {
        await prisma.milestone.deleteMany({
          where: { id: { in: idsToDelete } },
        })
      }

      // Upsert Milestones
      await Promise.all(
        milestones.map((m) =>
          m.id
            ? prisma.milestone.update({
                where: { id: m.id },
                data: { ...m, projectId },
              })
            : prisma.milestone.create({
                data: { ...m, projectId },
              }),
        ),
      )

      return project
    })

    return ProjectMapper.mapDefaultToApi(res)
  },
  createProject: async (input: CreateProjectInput, teamId: string) => {
    {
      const { newMilestones, newTags, ...proj } = input

      const existingProject = await db.project.findFirst({
        where: {
          teamId,
          name: proj.name,
        },
        select: {
          id: true,
        },
      })

      if (existingProject)
        throw new Error('Project name must be Unique across your Team.')

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

      return ProjectMapper.mapDefaultToApi(project)
    }
  },

  deleteProject: async (pid: string, teamId: string) => {
    try {
      await db.project.delete({
        where: { id: pid, teamId },
      })
    } catch (err) {
      console.info(err)
    }
  },

  archiveProject: async (
    projectId: string,
    teamId: string,
    archive: boolean,
  ) => {
    const res = await db.project.update({
      where: {
        id: projectId,
        teamId,
      },
      data: {
        archived: archive,
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
    return ProjectMapper.mapDefaultToApi(res)
  },
}
