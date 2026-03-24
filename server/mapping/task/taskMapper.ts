import type { Comment, Member, Project, Tag, Task } from '@prisma/client'
import type {
  SimpleTaskResponseType,
  TaskResponseType,
} from '@server/domain/taskSchema'
import { MemberMapper } from '../organization/memberMapping'
import { TagMapper } from '../organization/tagMapper'
import { CommentMapper } from './commentMapper'

export const TaskMapper = {
  mapDefaultToApi: (
    input: Task & {
      assignedTo: Member | null
      subtasks: Task[]
      parent: Task | null
      tags: Tag[]
      comments: (Comment & { member: Member })[]
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
      parent: input.parent ? TaskMapper.mapSimplifiedToApi(input.parent) : null,
      subtasks: input.subtasks.map((st) => TaskMapper.mapSimplifiedToApi(st)),

      assignedToId: input.assignedToId,
      assignedTo: input.assignedTo
        ? MemberMapper.mapDefaultToApi(input.assignedTo)
        : null,

      projectId: input.projectId,
      projectName: input.project.name,

      tags: input.tags.map((t) => TagMapper.mapDefaultToApi(t)),
      comments: input.comments.map((c) => CommentMapper.mapDefaultToApi(c)),
    } as TaskResponseType
  },

  mapSimplifiedToApi: (input: Task): SimpleTaskResponseType => {
    const { organizationId, projectId, ...data } = input
    return {
      assignedToId: data.assignedToId,
      dateCreated: data.dateCreated,
      description: data.description,
      dueDate: data.dueDate,
      id: data.id,
      priority: data.priority,
      startDate: data.startDate,
      status: data.status,
      taskCode: data.taskCode,
      title: data.title,
      type: data.type,
      updatedAt: data.updatedAt,
    }
  },
}
