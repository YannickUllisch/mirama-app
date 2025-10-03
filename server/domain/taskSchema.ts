import { PriorityType, TaskStatusType } from '@prisma/client'
import z from 'zod'
import { TaskTypeSchema } from './enumSchemas'

export const TaskProjectResponseSchema = z
  .object({
    assignedToId: z.string().nullable(),
    dueDate: z.date({ message: 'Due Date has to be defined' }),
    startDate: z.date({ message: 'Start Date has to be defined' }),
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    description: z.string().nullable(),
    priority: z.nativeEnum(PriorityType),
    status: z.nativeEnum(TaskStatusType),
    parentId: z.string().nullable(),
    type: TaskTypeSchema,
  })
  .refine((data) => data.startDate <= data.dueDate, {
    message: 'Start Date must be before or equal to Due Date',
    path: ['startDate'],
  })
