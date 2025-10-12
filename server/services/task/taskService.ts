import { TaskStatusType } from '@prisma/client'
import type {
  CreateTaskType,
  TaskResponseType,
  UpdateTaskType,
} from '@server/domain/taskSchema'
import { TaskMapper } from '@server/mapping/task'
import db from '@server/utils/db'
import { generateTaskId } from '@src/lib/helpers/TaskCodeGenerator'
import { isTaskTypeContainer } from '@src/lib/helpers/TaskTypeHelpers'
import { v4 } from 'uuid'

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

  createTask: async (
    pid: string,
    teamId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    payload: CreateTaskType,
  ) => {
    const { parentId, tags, newTags, subtasks, ...rest } = payload

    if (parentId && !isTaskTypeContainer(rest.type)) {
      throw new Error('This task type can not be assigned a parent')
    }

    const existingProject = await db.project.findFirst({
      where: {
        id: pid,
        teamId,
      },
      select: {
        name: true,
        users: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!existingProject) {
      throw new Error('Invalid Project')
    }

    if (
      !isAdminOrOwner &&
      !existingProject?.users.map((u) => u.userId).includes(sessionUserId)
    ) {
      throw new Error('Invalid permission')
    }

    const newTaskId = v4()
    const task = await db.task.create({
      data: {
        ...rest,
        id: newTaskId,
        tags: {
          connect: tags.map((id) => ({ id })),
          create: newTags.map((t) => ({
            id: v4(),
            title: t.title,
            teamId,
          })),
        },
        subtasks: {
          connect: subtasks.map((id) => ({ id })),
        },
        parentId: parentId,
        projectId: pid,
        teamId,
        taskCode: generateTaskId(existingProject.name, newTaskId),
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
    })

    return TaskMapper.mapDefaultToApi(task)
  },

  updateTask: async (
    tid: string,
    pid: string,
    teamId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    payload: UpdateTaskType,
  ) => {
    // Validation
    const task = await db.task.findFirst({
      where: {
        id: tid,
        projectId: pid,
        teamId,
      },
      select: {
        project: {
          select: {
            users: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    })

    if (!task) {
      throw new Error('Invalid Task')
    }

    if (
      !isAdminOrOwner &&
      !task.project?.users.map((u) => u.userId).includes(sessionUserId)
    ) {
      throw new Error('Invalid permission')
    }

    const { parentId, tags, newTags, subtasks, ...rest } = payload
    if (parentId && !isTaskTypeContainer(rest.type)) {
      throw new Error('This task type can not be assigned a parent')
    }

    const updatedTask = await db.task.update({
      where: {
        id: tid,
        projectId: pid,
        teamId,
      },
      data: {
        ...rest,
        tags: {
          connect: tags.map((id) => ({ id })),
          create: newTags.map((t) => ({
            id: v4(),
            title: t.title,
            teamId,
          })),
        },
        subtasks: {
          connect: subtasks.map((id) => ({ id })),
        },
        id: undefined,
        taskCode: undefined,
        projectId: undefined,
        teamId,
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
    })

    return TaskMapper.mapDefaultToApi(updatedTask)
  },

  /**
   * Deletes Tasks in Bulk for a specific Project, does not work across projects
   * @param pid ProjectId for which to remove tasks
   * @param teamId Requestee teamId
   * @param sessionUserId requesteeUserId
   * @param isAdminOrOwner Role check
   * @param payload string array containing IDs from query
   */
  deleteTasksBulk: async (
    pid: string,
    teamId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    payload: string[],
  ) => {
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

    if (!project) {
      throw new Error('Invalid Project')
    }

    if (
      !isAdminOrOwner &&
      !project?.users.map((u) => u.userId).includes(sessionUserId)
    ) {
      throw new Error('Invalid permission')
    }

    await db.task.deleteMany({
      where: {
        id: {
          in: payload,
        },
        teamId,
        projectId: pid,
      },
    })
  },

  /**
   * Deletes a single task by ID
   * @param tid TaskID to delete
   * @param pid ProjectId for which to remove tasks
   * @param teamId Requestee teamId
   * @param sessionUserId requesteeUserId
   * @param isAdminOrOwner Role check
   * @param payload string array containing IDs from query
   */
  deleteTask: async (
    tid: string,
    pid: string,
    teamId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ) => {
    const task = await db.task.findFirst({
      where: {
        id: tid,
        projectId: pid,
        teamId,
      },
      select: {
        project: {
          select: {
            users: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    })

    if (!task) {
      throw new Error('Invalid Task')
    }

    if (
      !isAdminOrOwner &&
      !task.project?.users.map((u) => u.userId).includes(sessionUserId)
    ) {
      throw new Error('Invalid permission')
    }

    await db.task.delete({
      where: {
        id: tid,
        teamId,
        projectId: pid,
      },
    })
  },
}
