import type { Comment, Project, Tag, Task, User } from '@prisma/client'
import type {
  SimpleTaskResponseType,
  TaskResponseType,
} from '@server/domain/taskSchema'
import { CommentMapper } from '../general/commentMapper'
import { TagMapper } from '../general/tagMapper'
import { UserMapper } from '../user/userMapping'

const mapDefaultToApi = (
  input: Task & {
    assignedTo: User | null
    subtasks: Task[]
    parent: Task | null
    tags: Tag[]
    comments: (Comment & { user: User })[]
    project: Partial<Project>
  },
): TaskResponseType => {
  return {
    id: input.id,
    taskCode: input.taskCode,
    title: input.title,
    type: input.type,
    description: input.description,
    priority: input.priority,
    status: input.status,

    startDate: input.startDate,
    dueDate: input.dueDate,

    dateCreated: input.dateCreated,
    updatedAt: input.updatedAt,

    parentId: input.parentId,
    parent: input.parent ? mapSimplifiedToApi(input.parent) : null,
    subtasks: input.subtasks.map((st) => mapSimplifiedToApi(st)),

    assignedToId: input.assignedToId,
    assignedTo: input.assignedTo
      ? UserMapper.mapDefaultToApi(input.assignedTo)
      : null,

    projectId: input.projectId,
    projectName: input.project.name,

    tags: input.tags.map((t) => TagMapper.mapDefaultToApi(t)),
    comments: input.comments.map((c) => CommentMapper.mapDefaultToApi(c)),
  } as TaskResponseType
}

const mapSimplifiedToApi = (input: Task): SimpleTaskResponseType => {
  const { teamId, projectId, ...data } = input
  return {
    ...data,
  }
}

export const TaskMapper = {
  mapDefaultToApi,
  mapSimplifiedToApi,
}
