import { PriorityType, TaskStatusType } from '@prisma/client'
import z from 'zod'
import { CommentResponseSchema } from './commentSchema'
import {
  PriorityTypeSchema,
  TaskStatusTypeSchema,
  TaskTypeSchema,
} from './enumSchemas'
import { CreateTagSchema, TagResponseSchema } from './tagSchema'
import { UserResponseSchema } from './userSchema'

export const SimpleTaskResponseSchema = z.object({
  id: z.string(),
  taskCode: z.string(),

  type: TaskTypeSchema,
  title: z.string().min(1, { message: 'Title cannot be empty.' }),
  description: z.string().nullable(),
  priority: PriorityTypeSchema,
  status: TaskStatusTypeSchema,

  startDate: z.date({ message: 'Start Date has to be defined' }),
  dueDate: z.date({ message: 'Due Date has to be defined' }),

  dateCreated: z.coerce.date(),
  updatedAt: z.coerce.date(),
  assignedToId: z.string().nullable(),
})

export const TaskResponseSchema = z
  .object({
    id: z.string(),
    taskCode: z.string(),

    type: TaskTypeSchema,
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    description: z.string().nullable(),
    priority: PriorityTypeSchema,
    status: TaskStatusTypeSchema,

    startDate: z.date({ message: 'Start Date has to be defined' }),
    dueDate: z.date({ message: 'Due Date has to be defined' }),

    parentId: z.string().nullable(),
    parent: z.lazy(() => SimpleTaskResponseSchema).nullable(),
    subtasks: z.lazy(() => z.array(SimpleTaskResponseSchema)).default([]),

    dateCreated: z.coerce.date(),
    updatedAt: z.coerce.date(),
    assignedTo: UserResponseSchema.nullable(),
    assignedToId: z.string().nullable(),

    projectId: z.string(),
    projectName: z.string(),
    tags: z.array(TagResponseSchema),
    comments: z.array(CommentResponseSchema),
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })
  .refine((data) => !data.subtasks.map((s) => s.id !== data.id), {
    message: 'Creating a cyclic Task dependency is not allowed',
    path: ['parentId'],
  })
  .refine((data) => data.parentId !== data.id, {
    message: 'A task cannot be its own parent',
    path: ['parentId'],
  })

export const TaskProjectResponseSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    type: TaskTypeSchema,
    assignedToId: z.string().nullable(),
    dueDate: z.coerce.date({ message: 'Due Date has to be defined' }),
    startDate: z.coerce.date({ message: 'Start Date has to be defined' }),
    description: z.string().nullable(),
    priority: z.nativeEnum(PriorityType),
    status: z.nativeEnum(TaskStatusType),
    parentId: z.string().nullable(),
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })

export const CreateTaskSchema = z
  .object({
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    type: TaskTypeSchema,
    description: z.string().nullable(),
    priority: PriorityTypeSchema.default(PriorityType.LOW),
    status: TaskStatusTypeSchema.default(TaskStatusType.NEW),

    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),

    tags: z.string().array(),
    newTags: z.array(CreateTagSchema),

    parentId: z.string().nullable(),
    assignedToId: z.string().nullable(),
    subtasks: z.string().array(),
    projectId: z.string(),
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })

export const UpdateTaskSchema = z
  .object({
    id: z.string(),
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    type: TaskTypeSchema,
    description: z.string().nullable(),
    priority: PriorityTypeSchema,
    status: TaskStatusTypeSchema,

    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    tags: z.string().array(),
    newTags: z.array(CreateTagSchema),

    parentId: z.string().nullable(),
    assignedToId: z.string().nullable(),
    subtasks: z.string().array(),
    projectId: z.string(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.dueDate) {
        return data.startDate <= data.dueDate
      }
      return true
    },
    {
      message: 'Start Date must be before or equal to Due Date',
      path: ['startDate'],
    },
  )
  .refine((data) => data.parentId !== data.id, {
    message: 'A task cannot be its own parent',
    path: ['parentId'],
  })

export const DeleteTasksSchema = z.object({
  ids: z
    .array(z.string())
    .min(1, { message: 'At least one task id is required' }),
})

export type TaskResponseType = z.infer<typeof TaskResponseSchema>
export type SimpleTaskResponseType = z.infer<typeof SimpleTaskResponseSchema>
export type TaskProjectResponseType = z.infer<typeof TaskProjectResponseSchema>
export type CreateTaskType = z.infer<typeof CreateTaskSchema>
export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>
export type DeleteTasksType = z.infer<typeof DeleteTasksSchema>
