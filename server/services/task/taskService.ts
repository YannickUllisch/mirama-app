import { TaskStatusType } from '@prisma/client'
import type { TaskResponseType } from '@server/domain/taskSchema'
import { TaskMapper } from '@server/mapping/task'
import db from '@server/utils/db'

export const TaskService = {
  getTasksByProjectId: async (
    pid: string,
    teamId: string,
    ignoreCompleted: boolean,
    sessionUserId: string,
    isTeamAdminOrOwner: boolean,
  ): Promise<TaskResponseType[]> => {
    const project = await db.project.findFirst({
      where: {
        id: pid,
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
      !project?.users.map((p) => p.userId).includes(sessionUserId) &&
      !isTeamAdminOrOwner
    ) {
      throw new Error('Invalid Permission')
    }

    const res = await db.task.findMany({
      where: {
        project: {
          id: pid,
          teamId,
        },
        ...(ignoreCompleted && {
          status: {
            not: TaskStatusType.DONE,
          },
        }),
      },

      include: {
        assignedTo: true,
        subtasks: true,
        tags: true,
        parent: true,
        comments: {
          include: {
            user: true,
          },
        },
        project: { select: { id: true, name: true } },
      },
      orderBy: {
        status: 'asc',
      },
    })

    return res.map((r) => TaskMapper.mapDefaultToApi(r))
  },

  getTaskById: async (
    id: string,
    projectId: string,
    teamId: string,
    sessionUserId: string,
    isTeamAdminOrOwner: boolean,
  ): Promise<TaskResponseType> => {
    // Permission and existence checks
    const [res, project] = await Promise.all([
      db.task.findFirst({
        where: { id, teamId, projectId },
        include: {
          assignedTo: true,
          subtasks: true,
          tags: true,
          parent: true,
          comments: { include: { user: true } },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { title: 'asc' },
      }),
      db.project.findFirst({
        where: { id: projectId, teamId },
        select: {
          users: { select: { userId: true } },
        },
      }),
    ])

    if (!res) throw new Error('Task not found')
    if (
      !project?.users.map((p) => p.userId).includes(sessionUserId) &&
      !isTeamAdminOrOwner
    ) {
      throw new Error('Invalid Permission')
    }

    return TaskMapper.mapDefaultToApi(res)
  },

  getPersonalTasks: async (
    userId: string,
    teamId: string,
    projectId?: string,
  ): Promise<TaskResponseType[]> => {
    const res = await db.task.findMany({
      where: {
        teamId,
        assignedToId: userId,
        projectId,
      },
      include: {
        assignedTo: true,
        subtasks: true,
        tags: true,
        parent: true,
        comments: {
          include: {
            user: true,
          },
        },
        project: { select: { id: true, name: true } },
      },
      orderBy: { title: 'asc' },
    })

    return res.map((r) => TaskMapper.mapDefaultToApi(r))
  },
}
