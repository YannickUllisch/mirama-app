import {
  FavouriteType as PrismaFavouriteType,
  PriorityType as PrismaPriorityType,
  StatusType as PrismaStatusType,
  TaskStatusType as PrismaTaskStatusType,
  TaskType as PrismaTaskType,
  Role,
} from '@prisma/client'
import z from 'zod'

export const RoleSchema = z.nativeEnum(Role)
export const PriorityTypeSchema = z.nativeEnum(PrismaPriorityType)
export const StatusTypeSchema = z.nativeEnum(PrismaStatusType)
export const TaskStatusTypeSchema = z.nativeEnum(PrismaTaskStatusType)
export const TaskTypeSchema = z.nativeEnum(PrismaTaskType)
export const FavouriteTypeSchema = z.nativeEnum(PrismaFavouriteType)

export type RoleType = z.infer<typeof RoleSchema>
export type PriorityType = z.infer<typeof PriorityTypeSchema>
export type StatusType = z.infer<typeof StatusTypeSchema>
export type TaskStatusType = z.infer<typeof TaskStatusTypeSchema>
export type TaskType = z.infer<typeof TaskTypeSchema>
export type FavouriteType = z.infer<typeof FavouriteTypeSchema>
