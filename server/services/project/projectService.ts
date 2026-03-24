import type { MemberResponseType } from '@server/domain/memberSchema'
import type {
  CreateProjectInput,
  ProjectResponseInput,
  UpdateProjectInput,
} from '@server/domain/projectSchema'
import { MemberMapper } from '@server/mapping/organization/memberMapping'
import { ProjectMapper } from '@server/mapping/project/projectMapping'
import db from '@server/utils/db'
import { v4 } from 'uuid'

export const ProjectService = {
  getAllProjects: async (
    sessionUserId: string,
    organizationId: string,
    onlyArchived: boolean,
    isOrgAdminOrOwner: boolean,
  ): Promise<ProjectResponseInput[]> => {
    const res = await db.project.findMany({
      where: {
        organizationId: organizationId,
        archived: onlyArchived,
        ...(isOrgAdminOrOwner
          ? {} // Admins should see all projects, so we remove the members filter
          : {
              members: {
                some: {
                  memberId: sessionUserId,
                },
              },
            }),
      },
      include: {
        milestones: true,
        tags: true,
        tasks: true,
        members: {
          include: {
            member: true,
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
    organizationId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ): Promise<MemberResponseType[]> => {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
      select: {
        members: {
          select: {
            memberId: true,
          },
        },
      },
    })

    if (
      !project?.members.map((u) => u.memberId).includes(sessionUserId) &&
      !isAdminOrOwner
    ) {
      throw new Error('Invalid permission')
    }

    const res = await db.member.findMany({
      where: {
        projects: {
          some: {
            projectId,
          },
        },
        organizationId: organizationId,
      },
    })

    return res.map((r) => MemberMapper.mapDefaultToApi(r))
  },

  getDefaultProjectResponse: async (
    projectId: string,
    organizationId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ): Promise<ProjectResponseInput | null> => {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        organizationId,
      },
      include: {
        milestones: true,
        tags: true,
        tasks: true,
        members: {
          include: {
            member: true,
          },
        },
      },
    })

    if (!project) throw new Error('Project not Found')

    if (
      !project.members.map((u) => u.memberId).includes(sessionUserId) &&
      !isAdminOrOwner
    ) {
      throw new Error('Invalid Permission')
    }

    return ProjectMapper.mapDefaultToApi(project)
  },

  updateProject: async (
    input: UpdateProjectInput,
    projectId: string,
    organizationId: string,
  ) => {
    const { members, milestones, tags, newTags, ...proj } = input

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
        where: { id: projectId, organizationId },
        data: {
          ...proj,
          tags: {
            connect: tags.map((id) => ({ id })),
            create: newTags.map((t) => ({
              id: v4(),
              title: t.title,
              organizationId,
            })),
          },
          organizationId,
        },
        include: {
          milestones: true,
          tags: true,
          tasks: true,
          members: {
            include: {
              member: true,
            },
          },
        },
      })

      // Update member relations
      await prisma.projectMember.deleteMany({ where: { projectId } })
      if (members && members.length > 0) {
        await prisma.projectMember.createMany({
          data: members.map((u) => ({ ...u, projectId })),
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
          prisma.milestone.upsert({
            where: { id: m.id ?? '' }, // If m.id is undefined, use an impossible id to force create
            update: { ...m, projectId },
            create: { ...m, id: m.id ?? v4(), projectId },
          }),
        ),
      )

      return project
    })

    return ProjectMapper.mapDefaultToApi(res)
  },
  createProject: async (input: CreateProjectInput, organizationId: string) => {
    {
      const { newMilestones, newTags, ...proj } = input

      const existingProject = await db.project.findFirst({
        where: {
          organizationId,
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
              organizationId,
            })),
          },
          members: {
            createMany: {
              data: input.members,
            },
          },
          milestones: {
            createMany: {
              data: input.newMilestones,
            },
          },
          organizationId,
        },
        include: {
          milestones: true,
          tags: true,
          tasks: true,
          members: {
            include: {
              member: true,
            },
          },
        },
      })

      return ProjectMapper.mapDefaultToApi(project)
    }
  },

  deleteProject: async (pid: string, organizationId: string) => {
    try {
      await db.project.delete({
        where: { id: pid, organizationId },
      })
    } catch (err) {
      console.info(err)
    }
  },

  archiveProject: async (
    projectId: string,
    organizationId: string,
    archive: boolean,
  ) => {
    const res = await db.project.update({
      where: {
        id: projectId,
        organizationId,
      },
      data: {
        archived: archive,
      },
      include: {
        milestones: true,
        tags: true,
        tasks: true,
        members: {
          include: {
            member: true,
          },
        },
      },
    })
    return ProjectMapper.mapDefaultToApi(res)
  },
}
