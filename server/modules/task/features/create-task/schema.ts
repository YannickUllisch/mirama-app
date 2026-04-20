import {
  PriorityType,
  TaskStatusType,
  TaskType,
} from '@/prisma/generated/client'
import { z } from 'zod'

const NewTagSchema = z.object({
  title: z.string().min(2),
})

export const CreateTaskSchema = z
  .object({
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    type: z.nativeEnum(TaskType).default(TaskType.TASK),
    description: z.string().nullable(),
    priority: z.nativeEnum(PriorityType).default(PriorityType.LOW),
    status: z.nativeEnum(TaskStatusType).default(TaskStatusType.NEW),
    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    tags: z.string().array(),
    newTags: z.array(NewTagSchema),
    parentId: z.string().nullable(),
    assignedToId: z.string().nullable(),
    subtasks: z.string().array(),
    projectId: z.string().min(1),
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })

export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>
