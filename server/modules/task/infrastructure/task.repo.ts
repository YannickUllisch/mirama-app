import type {
  Comment,
  Member,
  Project,
  Tag,
  Task,
  TaskStatusType,
} from '@/prisma/generated/client'
import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

const TASK_INCLUDE = {
  assignedTo: true,
  subtasks: true,
  tags: true,
  parent: true,
  comments: { include: { member: true } },
  project: { select: { id: true, name: true } },
} as const

export type TaskWithRelations = Task & {
  assignedTo: Member | null
  subtasks: Task[]
  parent: Task | null
  tags: Tag[]
  comments: (Comment & { member: Member })[]
  project: Pick<Project, 'id' | 'name'>
}

export const TaskRepository = (db: ScopedDb) => ({
  async findByProject(opts: {
    projectId: string
    ignoreCompleted: boolean
  }): Promise<TaskWithRelations[]> {
    return (await db.task.findMany({
      where: {
        projectId: opts.projectId,
        ...(opts.ignoreCompleted && {
          status: { not: 'DONE' as TaskStatusType },
        }),
      },
      include: TASK_INCLUDE,
      orderBy: { status: 'asc' },
    })) as TaskWithRelations[]
  },

  async findPersonal(opts: {
    assignedToId: string
    projectId?: string
  }): Promise<TaskWithRelations[]> {
    return (await db.task.findMany({
      where: {
        assignedToId: opts.assignedToId,
        ...(opts.projectId && { projectId: opts.projectId }),
      },
      include: TASK_INCLUDE,
      orderBy: { title: 'asc' },
    })) as TaskWithRelations[]
  },

  async findById(id: string): Promise<TaskWithRelations | null> {
    return (await db.task.findFirst({
      where: { id },
      include: TASK_INCLUDE,
    })) as TaskWithRelations | null
  },

  async findProjectMembers(projectId: string) {
    return await db.project.findFirst({
      where: { id: projectId },
      select: {
        name: true,
        members: { select: { memberId: true } },
      },
    })
  },

  // organizationId auto-injected by ScopedDb
  async create(data: {
    id: string
    taskCode: string
    title: string
    type: any
    description: string | null
    priority: any
    status: any
    startDate: Date
    dueDate: Date
    parentId: string | null
    assignedToId: string | null
    projectId: string
    tags: { connect: { id: string }[]; create: { title: string }[] }
    subtasks: { connect: { id: string }[] }
  }): Promise<TaskWithRelations> {
    return (await db.task.create({
      data: data as any,
      include: TASK_INCLUDE,
    })) as TaskWithRelations
  },

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<TaskWithRelations> {
    return (await db.task.update({
      where: { id },
      data,
      include: TASK_INCLUDE,
    })) as TaskWithRelations
  },

  async remove(id: string) {
    return await db.task.delete({ where: { id } })
  },

  async removeBulk(ids: string[]) {
    return await db.task.deleteMany({
      where: { id: { in: ids } },
    })
  },
})
