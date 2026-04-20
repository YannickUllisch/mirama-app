import {
  FavouriteType as PrismaFavouriteType,
  PriorityType as PrismaPriorityType,
  StatusType as PrismaStatusType,
  TaskStatusType as PrismaTaskStatusType,
  TaskType as PrismaTaskType,
  TenantRole,
} from '@/prisma/generated/client'
import z from 'zod'

export const TenantRoleSchema = z.enum(TenantRole)

export const PriorityTypeSchema = z.enum(PrismaPriorityType)
export const StatusTypeSchema = z.enum(PrismaStatusType)
export const TaskStatusTypeSchema = z.enum(PrismaTaskStatusType)
export const TaskTypeSchema = z.enum(PrismaTaskType)
export const FavouriteTypeSchema = z.enum(PrismaFavouriteType)

export type TenantRoleType = z.infer<typeof TenantRoleSchema>
export type PriorityType = z.infer<typeof PriorityTypeSchema>
export type StatusType = z.infer<typeof StatusTypeSchema>
export type TaskStatusType = z.infer<typeof TaskStatusTypeSchema>
export type TaskType = z.infer<typeof TaskTypeSchema>
export type FavouriteType = z.infer<typeof FavouriteTypeSchema>
