import { TaskStatusType } from '@prisma/client'
import type {
  CreateTaskType,
  TaskResponseType,
  UpdateTaskType,
} from '@server/domain/taskSchema'
import { TaskMapper } from '@server/mapping/task/taskMapper'
import db from '@server/utils/db'
import { generateTaskId } from '@src/lib/helpers/TaskCodeGenerator'
import { isTaskTypeContainer } from '@src/lib/helpers/TaskTypeHelpers'
import { v4 } from 'uuid'

export const TaskService = {
  getTasksByProjectId: async (
    pid: string,
    organizationId: string,
    ignoreCompleted: boolean,
    sessionUserId: string,
    isOrgAdminOrOwner: boolean,
  ): Promise<TaskResponseType[]> => {
    const project = await db.project.findFirst({
      where: {
        id: pid,
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
      !project?.members.map((p) => p.memberId).includes(sessionUserId) &&
      !isOrgAdminOrOwner
    ) {
      throw new Error('Invalid Permission')
    }

    const res = await db.task.findMany({
      where: {
        project: {
          id: pid,
          organizationId,
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
            member: true,
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
    organizationId: string,
    sessionUserId: string,
    isOrgAdminOrOwner: boolean,
  ): Promise<TaskResponseType> => {
    // Permission and existence checks
    const [res, project] = await Promise.all([
      db.task.findFirst({
        where: { id, organizationId, projectId },
        include: {
          assignedTo: true,
          subtasks: true,
          tags: true,
          parent: true,
          comments: { include: { member: true } },
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
        where: { id: projectId, organizationId },
        select: {
          members: { select: { memberId: true } },
        },
      }),
    ])

    if (!res) throw new Error('Task not found')
    if (
      !project?.members.map((p) => p.memberId).includes(sessionUserId) &&
      !isOrgAdminOrOwner
    ) {
      throw new Error('Invalid Permission')
    }

    return TaskMapper.mapDefaultToApi(res)
  },

  getPersonalTasks: async (
    userId: string,
    organizationId: string,
    projectId?: string,
  ): Promise<TaskResponseType[]> => {
    const res = await db.task.findMany({
      where: {
        organizationId,
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
            member: true,
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
    organizationId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    payload: CreateTaskType,
  ) => {
    const { parentId, tags, newTags, subtasks, ...rest } = payload

    if (parentId && isTaskTypeContainer(rest.type)) {
      throw new Error('This task type can not be assigned a parent')
    }

    const existingProject = await db.project.findFirst({
      where: {
        id: pid,
        organizationId,
      },
      select: {
        name: true,
        members: {
          select: {
            memberId: true,
          },
        },
      },
    })

    if (!existingProject) {
      throw new Error('Invalid Project')
    }

    if (
      !isAdminOrOwner &&
      !existingProject?.members.map((u) => u.memberId).includes(sessionUserId)
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
            organizationId,
          })),
        },
        subtasks: {
          connect: subtasks.map((id) => ({ id })),
        },
        parentId: parentId,
        projectId: pid,
        organizationId,
        taskCode: generateTaskId(existingProject.name, newTaskId),
      },
      include: {
        assignedTo: true,
        subtasks: true,
        tags: true,
        parent: true,
        comments: {
          include: {
            member: true,
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
    organizationId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    payload: UpdateTaskType,
  ) => {
    // Validation
    const task = await db.task.findFirst({
      where: {
        id: tid,
        projectId: pid,
        organizationId,
      },
      select: {
        project: {
          select: {
            members: {
              select: {
                memberId: true,
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
      !task.project?.members.map((u) => u.memberId).includes(sessionUserId)
    ) {
      throw new Error('Invalid permission')
    }

    const { parentId, tags, newTags, subtasks, ...rest } = payload
    if (parentId && isTaskTypeContainer(rest.type)) {
      throw new Error('This task type can not be assigned a parent')
    }

    const updatedTask = await db.task.update({
      where: {
        id: tid,
        projectId: pid,
        organizationId,
      },
      data: {
        ...rest,
        parentId,
        tags: {
          connect: tags.map((id) => ({ id })),
          create: newTags.map((t) => ({
            id: v4(),
            title: t.title,
            organizationId,
          })),
        },
        subtasks: {
          connect: subtasks.map((id) => ({ id })),
        },
        id: undefined,
        taskCode: undefined,
        projectId: undefined,
        organizationId,
      },
      include: {
        assignedTo: true,
        subtasks: true,
        tags: true,
        parent: true,
        comments: {
          include: {
            member: true,
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
   * @param organizationId Requestee organizationId
   * @param sessionUserId requesteeUserId
   * @param isAdminOrOwner Role check
   * @param payload string array containing IDs from query
   */
  deleteTasksBulk: async (
    pid: string,
    organizationId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
    payload: string[],
  ) => {
    const project = await db.project.findFirst({
      where: {
        id: pid,
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

    if (!project) {
      throw new Error('Invalid Project')
    }

    if (
      !isAdminOrOwner &&
      !project?.members.map((u) => u.memberId).includes(sessionUserId)
    ) {
      throw new Error('Invalid permission')
    }

    await db.task.deleteMany({
      where: {
        id: {
          in: payload,
        },
        organizationId,
        projectId: pid,
      },
    })
  },

  /**
   * Deletes a single task by ID
   * @param tid TaskID to delete
   * @param pid ProjectId for which to remove tasks
   * @param organizationId Requestee organizationId
   * @param sessionUserId requesteeUserId
   * @param isAdminOrOwner Role check
   * @param payload string array containing IDs from query
   */
  deleteTask: async (
    tid: string,
    pid: string,
    organizationId: string,
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ) => {
    const task = await db.task.findFirst({
      where: {
        id: tid,
        projectId: pid,
        organizationId,
      },
      select: {
        project: {
          select: {
            members: {
              select: {
                memberId: true,
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
      !task.project?.members.map((u) => u.memberId).includes(sessionUserId)
    ) {
      throw new Error('Invalid permission')
    }

    await db.task.delete({
      where: {
        id: tid,
        organizationId,
        projectId: pid,
      },
    })
  },
}
