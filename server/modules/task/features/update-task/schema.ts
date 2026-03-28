import { PriorityType, TaskStatusType, TaskType } from '@prisma/client'
import { z } from 'zod'

const NewTagSchema = z.object({
  title: z.string().min(2),
})

export const UpdateTaskSchema = z
  .object({
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    type: z.nativeEnum(TaskType),
    description: z.string().nullable(),
    priority: z.nativeEnum(PriorityType),
    status: z.nativeEnum(TaskStatusType),
    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    tags: z.string().array(),
    newTags: z.array(NewTagSchema),
    parentId: z.string().nullable(),
    assignedToId: z.string().nullable(),
    subtasks: z.string().array(),
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })

export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>
