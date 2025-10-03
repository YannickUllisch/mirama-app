import {
  PriorityType,
  StatusType,
  TaskStatusType,
  TaskType,
} from '@prisma/client'
import z from 'zod'

export const PriorityTypeSchema = z.nativeEnum(PriorityType)
export const StatusTypeSchema = z.nativeEnum(StatusType)
export const TaskStatusTypeSchema = z.nativeEnum(TaskStatusType)
export const TaskTypeSchema = z.nativeEnum(TaskType)
