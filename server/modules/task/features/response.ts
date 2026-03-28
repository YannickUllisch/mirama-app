import type {
  PriorityType,
  Task,
  TaskStatusType,
  TaskType,
} from '@prisma/client'
import type { TaskWithRelations } from '../infrastructure/task.repo'

export type TaskResponse = {
  id: string
  taskCode: string
  type: TaskType
  title: string
  description: string | null
  priority: PriorityType
  status: TaskStatusType
  startDate: Date
  dueDate: Date
  dateCreated: Date
  updatedAt: Date
  parentId: string | null
  parent: SimpleTaskResponse | null
  subtasks: SimpleTaskResponse[]
  assignedToId: string | null
  assignedTo: {
    id: string
    name: string
    email: string
    role: string
  } | null
  projectId: string
  projectName: string | undefined
  tags: { id: string; title: string }[]
  comments: {
    id: string
    content: string
    createdAt: Date
    parentId: string | null
    memberId: string
    memberName: string
  }[]
}

export type SimpleTaskResponse = {
  id: string
  taskCode: string
  type: string
  title: string
  description: string | null
  priority: string
  status: string
  startDate: Date
  dueDate: Date
  dateCreated: Date
  updatedAt: Date
  assignedToId: string | null
}

const toSimpleTask = (t: Task): SimpleTaskResponse => ({
  id: t.id,
  taskCode: t.taskCode,
  type: t.type,
  title: t.title,
  description: t.description,
  priority: t.priority,
  status: t.status,
  startDate: t.startDate,
  dueDate: t.dueDate,
  dateCreated: t.dateCreated,
  updatedAt: t.updatedAt,
  assignedToId: t.assignedToId,
})

export const toTaskResponse = (input: TaskWithRelations): TaskResponse => ({
  id: input.id,
  taskCode: input.taskCode,
  type: input.type,
  title: input.title,
  description: input.description,
  priority: input.priority,
  status: input.status,
  startDate: input.startDate,
  dueDate: input.dueDate,
  dateCreated: input.dateCreated,
  updatedAt: input.updatedAt,
  parentId: input.parentId,
  parent: input.parent ? toSimpleTask(input.parent) : null,
  subtasks: input.subtasks.map(toSimpleTask),
  assignedToId: input.assignedToId,
  assignedTo: input.assignedTo
    ? {
        id: input.assignedTo.id,
        name: input.assignedTo.name,
        email: input.assignedTo.email,
        role: input.assignedTo.role,
      }
    : null,
  projectId: input.projectId,
  projectName: input.project?.name,
  tags: input.tags.map((t) => ({ id: t.id, title: t.title })),
  comments: input.comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    parentId: c.parentId,
    memberId: c.memberId,
    memberName: c.member.name,
  })),
})
